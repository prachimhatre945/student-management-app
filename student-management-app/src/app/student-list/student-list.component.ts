import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent {
  headersMapping: { [key: string]: string } = {
    actions: 'Actions',
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    bloodGroup: 'Blood Group',
    state: 'State',
    country: 'Country',
    city: 'City',
    pincode: 'Pincode',
    institute: 'Institute',
    gender: 'Gender',
    email: 'Email',
    mobileNumber: 'Mobile Number',
    courseType: 'Course Type',
    duration: 'Duration',
    stream: 'Stream',
  };
  displayedColumns: string[] = [
    'actions',
    'firstName',
    'lastName',
    'dateOfBirth',
    'bloodGroup',
    'state',
    'country',
    'city',
    'pincode',
    'institute',
    'gender',
    'email',
    'mobileNumber',
    'courseType',
    'duration',
    'stream',
  ];
  studentData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  constructor(private router: Router) {}
  ngOnInit() {
    this.loadStudentRecords();
    this.dataSource = new MatTableDataSource(this.studentData);
  }
  loadStudentRecords() {
    const storedRecords = localStorage.getItem('studentRecords');
    if (storedRecords) {
      this.studentData = JSON.parse(storedRecords);
    }
    this.dataSource = new MatTableDataSource(this.studentData);
  }
  editStudent(item: any) {
    localStorage.setItem('itemToEdit', JSON.stringify(item));
    this.router.navigate(['/student-form']);
  }
  deleteStudent(data: any) {
    const index = this.studentData.findIndex((item) => item.id == data.id);
    if (index !== -1) {
      this.studentData.splice(index, 1);
    }
    this.dataSource = new MatTableDataSource(this.studentData);
    localStorage.setItem('studentRecords', JSON.stringify(this.studentData));
  }
  add(){
    this.router.navigate(['/student-form']);
  }
}
