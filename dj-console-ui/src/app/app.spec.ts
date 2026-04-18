import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideApollo } from 'apollo-angular';

import { App } from './app';
import { createApolloOptions } from './graphql/graphql.provider';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [...(provideApollo(createApolloOptions) as Provider[])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render DJ console heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.deck__title')?.textContent).toContain('DJ Console');
  });
});
