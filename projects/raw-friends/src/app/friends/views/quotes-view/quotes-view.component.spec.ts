import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesViewComponent } from './quotes-view.component';
import {FriendsModule} from '../../friends.module';

describe('QuotesViewComponent', () => {
  let component: QuotesViewComponent;
  let fixture: ComponentFixture<QuotesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotesViewComponent],
      imports: [FriendsModule]
    });
    fixture = TestBed.createComponent(QuotesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
