import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WxComponent} from './wx.component';

describe('ModalComponent', () => {
  let component: WxComponent;
  let fixture: ComponentFixture<WxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
