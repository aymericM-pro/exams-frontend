import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

type ClassLevel = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';

@Component({
  standalone: true,
  selector: 'create-classes',
  templateUrl: './create-classes.component.html',
  styleUrls: ['./create-classes.component.scss'],
  imports: [FormsModule],
})
export class CreateClassComponent {
  // ---- Class fields
  readonly level = signal<ClassLevel>('M1');
  readonly year = signal('');
  readonly description = signal('');

  // ---- Users (mock)
  readonly allUsers = signal<User[]>([
    { id: '1', firstName: 'Alice', lastName: 'Martin', email: 'alice@mail.com' },
    { id: '2', firstName: 'Bob', lastName: 'Durand', email: 'bob@mail.com' },
    { id: '3', firstName: 'Charlie', lastName: 'Petit', email: 'charlie@mail.com' },
    { id: '4', firstName: 'Diana', lastName: 'Leroy', email: 'diana@mail.com' },
    { id: '5', firstName: 'Ethan', lastName: 'Moreau', email: 'ethan@mail.com' },
  ]);

  readonly filteredUsers = signal<User[]>([]);
  readonly selectedUsers = signal<User[]>([]);

  readonly submitting = signal(false);

  constructor(private readonly router: Router) {}

  // ---- Search users
  onSearch(query: string): void {
    if (!query) {
      this.filteredUsers.set([]);
      return;
    }

    const q = query.toLowerCase();

    this.filteredUsers.set(
      this.allUsers()
        .filter(
          (u) =>
            u.firstName.toLowerCase().includes(q) ||
            u.lastName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        )
        .filter((u) => !this.selectedUsers().some((s) => s.id === u.id)),
    );
  }

  // ---- Select / remove users
  addUser(user: User): void {
    this.selectedUsers.update((list) => [...list, user]);
    this.filteredUsers.set([]);
  }

  removeUser(user: User): void {
    this.selectedUsers.update((list) => list.filter((u) => u.id !== user.id));
  }

  // ---- Submit
  submit(): void {
    if (!this.level() || !this.year()) {
      return;
    }

    this.submitting.set(true);

    const payload = {
      level: this.level(),
      year: this.year(),
      description: this.description(),
      studentIds: this.selectedUsers().map((u) => u.id),
    };

    console.log('CREATE CLASS PAYLOAD', payload);

    setTimeout(() => {
      this.submitting.set(false);
      this.router.navigate(['/classes']);
    }, 600);
  }

  cancel(): void {
    this.router.navigate(['/classes']);
  }
}
