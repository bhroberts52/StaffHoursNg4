import { StaffHoursNg4Page } from './app.po';

describe('staff-hours-ng4 App', () => {
  let page: StaffHoursNg4Page;

  beforeEach(() => {
    page = new StaffHoursNg4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
