import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent {
  studentForm!: FormGroup;
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  states: string[] = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
  ];
  countries: string[] = [
    'India',
    'United States',
    'China',
    'Brazil',
    'Russia',
    'Germany',
    'United Kingdom',
    'France',
    'Italy',
    'Japan',
  ];
  studentsData: any[] = [];
  streamsForUndergraduate = ['Engineering', 'Science', 'Commerce'];
  streamsForPostgraduate = ['MBA', 'MCA', 'M.Tech'];
  durations: string[] = ['Full Time', 'Part Time'];

  filteredStates: Observable<string[]> | undefined;
  filteredCountries: Observable<string[]> | undefined;
  flag: boolean = false;
  parsedItem: any;
  selectedBloodGroup: string = '';
  count = 0;
  constructor(private fb: FormBuilder, private router: Router) {}
  ngOnInit() {
    this.createForm(this.flag);
    const itemToEdit = localStorage.getItem('itemToEdit');
    if (itemToEdit) {
      this.flag = true;
      this.parsedItem = JSON.parse(itemToEdit);
      this.createForm(this.flag);
    }
    this.filteredStates = this.studentForm?.get('state')?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterStates(value))
    );
    this.filteredCountries = this.studentForm
      ?.get('country')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCountries(value))
      );
    this.studentForm.get('courseType')?.valueChanges.subscribe((type) => {
      this.studentForm.patchValue({ courseStream: '' });
    });
  }

  createForm(flag: boolean) {
    if (flag) {
      this.studentForm?.patchValue({
        id: this.parsedItem?.id,
        firstName: this.parsedItem?.firstName,
        lastName: this.parsedItem?.lastName,
        middleName: this.parsedItem?.middleName,
        dateOfBirth: this.parsedItem?.dateOfBirth,
        bloodGroup: this.parsedItem?.bloodGroup,
        state: this.parsedItem?.state,
        country: this.parsedItem?.country,
        city: this.parsedItem?.city,
        pincode: this.parsedItem?.pincode,
        institute: this.parsedItem?.institute,
        gender: this.parsedItem?.gender,
        email: this.parsedItem?.email,
        mobileNumber: this.parsedItem?.mobileNumber,
        courseType: this.parsedItem?.courseType,
        duration: this.parsedItem?.duration,
        stream: this.parsedItem?.stream,
      });
    } else {
      this.studentForm = this.fb.group({
        id: [''],
        firstName: ['', Validators.required],
        middleName: ['', Validators.required],
        lastName: ['', Validators.required],
        dateOfBirth: [null],
        bloodGroup: [null],
        state: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        institute: ['', Validators.required],
        gender: [''],
        email: ['', [Validators.required, Validators.email]],
        mobileNumber: [
          '',
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        courseType: [''],
        duration: [null],
        stream: [null],
      });
    }
  }
  _filterStates(value: string): string[] {
    const filterValue = value?.toLowerCase();
    return this.states.filter((state) =>
      state.toLowerCase().includes(filterValue)
    );
  }
  private _filterCountries(value: string): string[] {
    const filterValue = value?.toLowerCase();
    return this.countries.filter((country) =>
      country.toLowerCase().includes(filterValue)
    );
  }
  onSubmit() {
    localStorage.removeItem('itemToEdit');
    const storedRecords = localStorage.getItem('studentRecords');
    if (storedRecords) {
      this.studentsData = JSON.parse(storedRecords);
    }
    if (this.studentForm.valid) {
      if (this.flag) {
        const idToUpdate = this.studentForm?.get('id')?.value;
        const indexToUpdate = this.studentsData.findIndex(
          (x) => x.id === idToUpdate
        );
        if (indexToUpdate !== -1) {
          this.studentsData[indexToUpdate] = {
            id: idToUpdate,
            firstName: this.studentForm.get('firstName')?.value,
            lastName: this.studentForm.get('lastName')?.value,
            middleName: this.studentForm.get('middleName')?.value,
            dateOfBirth: this.studentForm.get('dateOfBirth')?.value,
            bloodGroup: this.studentForm.get('bloodGroup')?.value,
            state: this.studentForm.get('state')?.value,
            country: this.studentForm.get('country')?.value,
            city: this.studentForm.get('city')?.value,
            pincode: this.studentForm.get('pincode')?.value,
            institute: this.studentForm.get('institute')?.value,
            gender: this.studentForm.get('gender')?.value,
            email: this.studentForm.get('email')?.value,
            mobileNumber: this.studentForm.get('mobileNumber')?.value,
            courseType: this.studentForm.get('courseType')?.value,
            duration: this.studentForm.get('duration')?.value,
            stream: this.studentForm.get('stream')?.value,
          };
          localStorage.setItem(
            'studentRecords',
            JSON.stringify(this.studentsData)
          );
        }
      } else {
        this.count = this.studentsData.length
          ? this.studentsData.length + 1
          : 1;
        this.studentForm.get('id')?.patchValue(this.count);
        this.studentsData.push(this.studentForm.value);
        localStorage.setItem(
          'studentRecords',
          JSON.stringify(this.studentsData)
        );
        this.studentForm.reset();
        this.studentForm.updateValueAndValidity();
      }
      this.router.navigate(['/student-list']);
    } else {
      console.error('Form is invalid. Cannot submit!');
    }
  }

  loadStudentRecords() {
    const storedRecords = localStorage.getItem('studentRecords');
    if (storedRecords) {
      this.studentsData = JSON.parse(storedRecords);
    }
  }
}
