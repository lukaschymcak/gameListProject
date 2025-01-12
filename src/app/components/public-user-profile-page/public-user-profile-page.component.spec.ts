import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicUserProfilePageComponent } from './public-user-profile-page.component';

describe('PublicUserProfilePageComponent', () => {
  let component: PublicUserProfilePageComponent;
  let fixture: ComponentFixture<PublicUserProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicUserProfilePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicUserProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
