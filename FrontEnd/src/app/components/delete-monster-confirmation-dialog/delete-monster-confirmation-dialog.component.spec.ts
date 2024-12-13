import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMonsterConfirmationDialogComponent } from './delete-monster-confirmation-dialog.component';

describe('DeleteMonsterConfirmationDialogComponent', () => {
  let component: DeleteMonsterConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteMonsterConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMonsterConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMonsterConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
