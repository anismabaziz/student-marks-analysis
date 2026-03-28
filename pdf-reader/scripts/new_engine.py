#!/usr/bin/env python3
"""
Ultimate Deliberation Parser v2 - Enhanced Debug Version
=========================================================
Improvements:
- Better Systèmes d'Information detection
- More robust student row parsing
- Debug output to identify issues
- Handles all edge cases
"""

import fitz  # PyMuPDF
import re
import json
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from pathlib import Path
import time


@dataclass
class AcademicInfo:
    """Academic metadata"""
    year: str = ""
    semester: str = ""
    level: str = ""
    specialty: str = ""
    filiere: str = ""
    domain: str = ""
    session: str = ""
    total_students: int = 0
    admitted: int = 0
    failed: int = 0


@dataclass
class Module:
    """Module information"""
    code: str
    name: str
    column_indices: List[int]
    ue_code: str = ""


@dataclass
class Student:
    """Student record"""
    rank: int
    name: str
    matricule: str
    module_grades: Dict[str, float] = field(default_factory=dict)
    semester_average: float = 0.0
    semester_credits: int = 0
    status: str = ""


class UltimateDeliberationParser:
    """
    High-performance parser for academic deliberation PDFs v2
    """
    
    def __init__(self, pdf_path: str, debug: bool = False):
        self.pdf_path = pdf_path
        self.doc = fitz.open(pdf_path)
        self.info = AcademicInfo()
        self.modules: List[Module] = []
        self.students: List[Student] = []
        self.debug = debug
        
        # Metadata patterns
        self.patterns = {
            'year': r'(\d{4}[/\-]\d{4})',
            'semester': r'Semestre\s+(\d+)',
            'level': r'Licence\s+(\d+)(?:ème|er)?\s+Année',
            'session': r'\(Session\s*:?\s*(\w+)\)',
            'specialty': r'Spécialité[\s:]+([^\n]+)',
            'filiere': r'Filière[\s:]+([^\n]+)',
            'domain': r'Domaine[\s:]+([^\n]+)',
            'total': r'Nombre total des étudiants[\s:]+(\d+)',
            'admitted': r'Nombre total étudiants admis[\s:]+(\d+)',
            'failed': r'Nombre des étudiants ajournés[\s:]+(\d+)',
        }
        
        # Skip patterns - ignore these cells during module detection
        self.skip_patterns = [
            r'moyenne',
            r'crédit',
            r'semestre',
            r'ue\s*$',
            r'^\s*$',
        ]
    
    def parse(self) -> Dict:
        """Main parsing method"""
        start = time.time()
        print("🚀 Starting ultimate parser v2...")
        
        # Step 1: Extract metadata
        self._extract_metadata()
        print(f"✓ Metadata: L{self.info.level} S{self.info.semester} {self.info.year}")
        
        # Step 2: Detect modules
        self._detect_modules()
        print(f"✓ Modules: {len(self.modules)} detected")
        
        # Step 3: Parse students
        self._parse_students()
        print(f"✓ Students: {len(self.students)} parsed")
        
        elapsed = time.time() - start
        print(f"⚡ Completed in {elapsed:.2f}s")
        
        return self.to_dict()
    
    def _extract_metadata(self):
        """Extract metadata from first page"""
        page = self.doc[0]
        text = page.get_text()
        
        for key, pattern in self.patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                value = match.group(1).strip()
                if key in ['total', 'admitted', 'failed']:
                    setattr(self.info, key, int(value))
                else:
                    setattr(self.info, key, value)
    
    def _detect_modules(self):
        """Dynamically detect all modules from table structure"""
        page = self.doc[0]
        tables = page.find_tables()
        if not tables:
            return
        
        table = tables[0]
        data = table.extract()
        
        # Row 0: UE codes
        # Row 1: Module names
        ue_row = data[0]
        name_row = data[1]
        
        if self.debug:
            print("\n[DEBUG] Header analysis:")
            for i in range(min(20, len(name_row))):
                if name_row[i]:
                    print(f"  Col {i:2d}: UE={ue_row[i] if i < len(ue_row) else ''} | Name={str(name_row[i])[:80]}")
        
        current_ue = ""
        module_map = {}  # {module_name: {code, ue, cols}}
        
        for col_idx in range(2, len(ue_row)):
            # Detect UE boundaries
            ue_cell = str(ue_row[col_idx] or "").strip()
            if ue_cell and (ue_cell.startswith('C00') or ue_cell.startswith('C01')):
                current_ue = ue_cell
            
            # Get module name
            name_cell = str(name_row[col_idx] or "").strip()
            
            # Clean name - normalize spaces
            clean_name = ' '.join(name_cell.split()).lower()
            
            # Skip empty or meaningless cells
            if not clean_name or len(clean_name) < 3:
                continue
            
            # Check if this cell should be skipped
            should_skip = False
            for skip_pattern in self.skip_patterns:
                if re.search(skip_pattern, clean_name, re.IGNORECASE):
                    should_skip = True
                    break
            
            if should_skip:
                if self.debug:
                    print(f"  SKIP Col {col_idx}: '{clean_name[:50]}'")
                continue
            
            if self.debug:
                print(f"\n[DEBUG] DETECTED MODULE Col {col_idx}: '{name_cell[:80]}'")
            
            # Generate code from first letters (or use full name if short)
            words = name_cell.split()
            if len(words) >= 2:
                code = ''.join([w[0].upper() for w in words[:3] if w and w[0].isalpha()])
            else:
                code = name_cell[:6].upper().replace(' ', '')
            
            # Use original name with proper capitalization
            full_name = ' '.join(name_cell.split())
            
            if full_name not in module_map:
                module_map[full_name] = {'code': code, 'ue': current_ue, 'cols': []}
            module_map[full_name]['cols'].append(col_idx)
        
        # Convert to Module objects
        for name, info in module_map.items():
            self.modules.append(Module(
                code=info['code'],
                name=name,
                column_indices=info['cols'],
                ue_code=info['ue']
            ))
        
        # Find semester stats columns
        self.avg_col = None
        self.cred_col = None
        for col_idx in range(len(name_row)):
            cell = str(name_row[col_idx] or "").lower()
            if 'moyenne' in cell and 'semestre' in cell:
                self.avg_col = col_idx
                if self.debug:
                    print(f"[DEBUG] Semester average column: {col_idx}")
            elif 'crédit' in cell and 'semestre' in cell:
                self.cred_col = col_idx
                if self.debug:
                    print(f"[DEBUG] Semester credits column: {col_idx}")
    
    def _parse_students(self):
        """Parse all students from all pages"""
        total_rows = 0
        parsed_students = 0
        
        for page_num in range(len(self.doc)):
            page = self.doc[page_num]
            tables = page.find_tables()
            if not tables:
                continue
            
            data = tables[0].extract()
            
            # On first page, find where student data starts
            start_row = 0
            if page_num == 0:
                for i in range(len(data)):
                    if data[i] and data[i][0]:
                        first_cell = str(data[i][0]).strip()
                        if re.match(r'^\s*\d+\s*[-–]', first_cell):
                            start_row = i
                            break
            
            # Parse each row
            for row_idx, row in enumerate(data[start_row:], start=start_row):
                total_rows += 1
                student = self._parse_student_row(row)
                if student:
                    self.students.append(student)
                    parsed_students += 1
        
        if self.debug:
            print(f"[DEBUG] Processed {total_rows} total rows, parsed {parsed_students} students")
    
    def _parse_student_row(self, row: List) -> Optional[Student]:
        """Parse single student row"""
        if not row or not row[0]:
            return None
        
        # Match pattern: "1 - STUDENT NAME" or "1- STUDENT NAME"
        first = str(row[0]).strip()
        match = re.match(r'^\s*(\d+)\s*[-–]\s*([A-ZÀ-Ÿ][A-ZÀ-ÿ\s\'-]+)', first)
        
        if not match:
            return None
        
        try:
            rank = int(match.group(1))
            name = match.group(2).strip()
            matricule = str(row[1]).strip() if len(row) > 1 else ""
            
            student = Student(rank=rank, name=name, matricule=matricule)
            
            # Extract module grades
            for module in self.modules:
                grades = []
                for col_idx in module.column_indices:
                    if col_idx < len(row):
                        grade = self._to_float(row[col_idx])
                        if grade > 0:
                            grades.append(grade)
                
                if grades:
                    student.module_grades[module.name] = sum(grades) / len(grades)
            
            # Extract semester stats
            if self.avg_col and self.avg_col < len(row):
                student.semester_average = self._to_float(row[self.avg_col])
            
            if self.cred_col and self.cred_col < len(row):
                student.semester_credits = int(self._to_float(row[self.cred_col]))
            
            # Determine status
            if student.semester_credits >= 30:
                student.status = "Admis"
            elif student.semester_credits >= 20:
                student.status = "Passage Conditionnel"
            elif student.semester_credits >= 10:
                student.status = "Redoublement Partiel"
            else:
                student.status = "Ajourné"
            
            return student
        
        except Exception as e:
            if self.debug:
                print(f"[DEBUG] Error parsing row: {e}")
            return None
    
    def _to_float(self, value) -> float:
        """Convert value to float"""
        if value is None or value == '':
            return 0.0
        
        clean = re.sub(r'[^\d,.\-]', '', str(value))
        if not clean or clean in ['-', '.', ',']:
            return 0.0
        
        try:
            return float(clean.replace(',', '.'))
        except:
            return 0.0
    
    def get_top_students(self, n: int = 5) -> List[Dict]:
        """Get top N students by semester average"""
        sorted_students = sorted(
            [s for s in self.students if s.semester_average > 0],
            key=lambda s: s.semester_average,
            reverse=True
        )
        
        return [
            {
                'rank': i + 1,
                'name': s.name,
                'matricule': s.matricule,
                'average': round(s.semester_average, 2),
                'credits': s.semester_credits,
                'status': s.status
            }
            for i, s in enumerate(sorted_students[:n])
        ]
    
    def get_statistics(self) -> Dict:
        """Calculate comprehensive statistics"""
        if not self.students:
            return {}
        
        total = len(self.students)
        status_counts = {}
        for s in self.students:
            status_counts[s.status] = status_counts.get(s.status, 0) + 1
        
        averages = [s.semester_average for s in self.students if s.semester_average > 0]
        sorted_avgs = sorted(averages)
        
        # Module stats
        module_stats = {}
        for module in self.modules:
            grades = [s.module_grades.get(module.name, 0) for s in self.students]
            grades = [g for g in grades if g > 0]
            if grades:
                module_stats[module.name] = {
                    'average': round(sum(grades) / len(grades), 2),
                    'highest': round(max(grades), 2),
                    'lowest': round(min(grades), 2),
                    'passing': sum(1 for g in grades if g >= 10)
                }
        
        return {
            'total_students': total,
            'by_status': status_counts,
            'pass_rate': f"{(status_counts.get('Admis', 0) / total * 100):.2f}%",
            'semester_stats': {
                'average': round(sum(averages) / len(averages), 2) if averages else 0,
                'highest': round(max(averages), 2) if averages else 0,
                'lowest': round(min(averages), 2) if averages else 0,
                'median': round(sorted_avgs[len(sorted_avgs) // 2], 2) if sorted_avgs else 0
            },
            'module_stats': module_stats
        }
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            'metadata': {
                'year': self.info.year,
                'semester': self.info.semester,
                'level': self.info.level,
                'specialty': self.info.specialty,
                'filiere': self.info.filiere,
                'domain': self.info.domain,
                'session': self.info.session,
                'total_students': self.info.total_students,
                'admitted': self.info.admitted,
                'failed': self.info.failed
            },
            'modules': [
                {
                    'code': m.code,
                    'name': m.name,
                    'ue': m.ue_code
                }
                for m in self.modules
            ],
            'students': [
                {
                    'rank': s.rank,
                    'name': s.name,
                    'matricule': s.matricule,
                    'grades': {k: round(v, 2) for k, v in s.module_grades.items()},
                    'semester_average': round(s.semester_average, 2),
                    'semester_credits': s.semester_credits,
                    'status': s.status
                }
                for s in self.students
            ]
        }
    
    def to_json(self, output_path: str):
        """Export to JSON"""
        data = self.to_dict()
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def close(self):
        """Close PDF document"""
        self.doc.close()


def main():
    """Main execution with option for debug mode"""
    import sys
    
    # Check if PDF path provided
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
    else:
        # Try default location
        pdf_path = "/mnt/user-data/uploads/Deliberation_2024_2025_L2_S3.pdf"
        if not Path(pdf_path).exists():
            print("❌ No PDF file found. Please provide path as argument.")
            print("Usage: python ultimate_parser.py <path_to_pdf>")
            return
    
    # Enable debug if requested
    debug_mode = '--debug' in sys.argv
    
    print(f"📄 File: {Path(pdf_path).name}")
    print("=" * 70)
    
    # Parse
    parser = UltimateDeliberationParser(pdf_path, debug=debug_mode)
    result = parser.parse()
    
    # Display metadata
    meta = result['metadata']
    print(f"\n📊 ACADEMIC INFO:")
    print(f"   Year: {meta['year']}")
    print(f"   Level: Licence {meta['level']} - Semester {meta['semester']}")
    print(f"   Specialty: {meta['specialty']}")
    print(f"   Filière: {meta['filiere']}")
    print(f"   Session: {meta['session']}")
    
    # Display modules
    print(f"\n📚 MODULES ({len(result['modules'])}):")
    for i, mod in enumerate(result['modules'], 1):
        print(f"   {i}. [{mod['code']:4s}] {mod['name']}")
    
    # Display top performers
    print(f"\n🏆 TOP 5 STUDENTS (Highest Semester Averages):")
    top_students = parser.get_top_students(5)
    for student in top_students:
        print(f"\n   {student['rank']}. {student['name']}")
        print(f"      Matricule: {student['matricule']}")
        print(f"      Average: {student['average']:.2f}/20")
        print(f"      Credits: {student['credits']}/30")
        print(f"      Status: ✅ {student['status']}")
    
    # Statistics
    stats = parser.get_statistics()
    print(f"\n📈 OVERALL STATISTICS:")
    print(f"   Total Students: {stats['total_students']}")
    print(f"\n   Status Distribution:")
    for status, count in stats['by_status'].items():
        pct = (count / stats['total_students'] * 100)
        emoji = "✅" if status == "Admis" else "⚠️" if "Conditionnel" in status else "📝" if "Partiel" in status else "❌"
        print(f"   {emoji} {status}: {count} ({pct:.1f}%)")
    print(f"\n   Pass Rate: {stats['pass_rate']}")
    
    print(f"\n   Semester Performance:")
    sem_stats = stats['semester_stats']
    print(f"   Average: {sem_stats['average']:.2f}/20")
    print(f"   Highest: {sem_stats['highest']:.2f}/20")
    print(f"   Lowest: {sem_stats['lowest']:.2f}/20")
    print(f"   Median: {sem_stats['median']:.2f}/20")
    
    print(f"\n   Module Performance:")
    for mod_name, mod_stats in stats['module_stats'].items():
        print(f"   • {mod_name[:35]:35s} → Avg: {mod_stats['average']:5.2f} | Passing: {mod_stats['passing']}")
    
    # Save
    output_path = "/mnt/user-data/outputs/deliberation_ultimate.json"
    parser.to_json(output_path)
    print(f"\n💾 Full data saved to: {output_path}")
    
    parser.close()
    return parser


if __name__ == "__main__":
    main()