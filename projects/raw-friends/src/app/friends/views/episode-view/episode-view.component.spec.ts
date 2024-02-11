import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FriendsModule} from '../../friends.module';
import {QuoteService} from '../../services/quote.service';
import {Quote} from '../../domain/quote.model';
import {Character} from '../../domain/character.model';
import {Episode} from '../../domain/episode.model';
import {of, Subject, throwError} from 'rxjs';
import {AppRoutingModule} from '../../../app-routing.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {EpisodeViewComponent} from './episode-view.component';
import {ActivatedRoute} from '@angular/router';

describe('EpisodeViewComponent', () => {
  let quoteService: jest.Mocked<QuoteService>;

  // init quotes mock service
  beforeEach(() => {
    quoteService = quoteService = {
      getQuotes: jest.fn(),
      getCharacters: jest.fn(),
      getEpisodes: jest.fn(),
    } as unknown as jest.Mocked<QuoteService>;
  });

  // init test bed
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpisodeViewComponent],
      imports: [FriendsModule, AppRoutingModule, NoopAnimationsModule],
      // js-dom cannot handle animations
      // so import NoopAnimationsModule
      providers: [
        {provide: QuoteService, useValue: quoteService},
        {
          provide: ActivatedRoute,
          useValue: {params: of({id: '1'})} // Provide a mock ActivatedRoute with a test parameter
        }
      ],
    });
  });

  it('create', () => {
    const fixture = TestBed.createComponent(EpisodeViewComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('load quotes on initialization', () => {
    // get quotes init
    quoteService.getQuotes.mockReturnValue(of(mockQuotes));

    // prepare fixture
    const fixture = TestBed.createComponent(EpisodeViewComponent);
    fixture.detectChanges();

    // load mock quotes
    expect(selectFixture(fixture, '.quote-item:nth-child(1) .character-name').textContent).toContain('Character 1');
    expect(selectFixture(fixture, '.quote-item:nth-child(1) .quote-text').textContent).toContain('Quote 1');
    expect(selectAllFixture(fixture, '.quote-item')).toHaveLength(1); // only episode 1 quotes
  });

  it('display "Loading quotes..." on loading', () => {
    // Given empty observable
    let subject = new Subject<Quote[]>();
    quoteService.getQuotes.mockReturnValue(subject);

    // prepare fixture
    const fixture = TestBed.createComponent(EpisodeViewComponent);
    fixture.detectChanges();

    expect(selectFixture(fixture, '.loading-indicator').textContent).toContain('Loading quotes...');

    // load mock quotes
    subject.next(mockQuotes);
    subject.complete();
    fixture.detectChanges();

    expect(selectFixture(fixture, '.loading-indicator')).toBeNull();

    expect(selectFixture(fixture, '.quote-item:nth-child(1) .character-name').textContent).toContain('Character 1');
    expect(selectFixture(fixture, '.quote-item:nth-child(1) .quote-text').textContent).toContain('Quote 1');
    expect(selectAllFixture(fixture, '.quote-item')).toHaveLength(1); // only episode 1 quotes

  });

  it('display "No quotes available." on empty', () => {
    // get quotes init
    quoteService.getQuotes.mockReturnValue(of([]));

    // prepare fixture
    const fixture = TestBed.createComponent(EpisodeViewComponent);
    fixture.detectChanges();

    // no quotes
    expect(selectFixture(fixture, '.no-quotes').textContent).toContain('No quotes available.');
  });

  it('display "Cannot load quotes." on error', () => {
    // get quotes is errored
    quoteService.getQuotes.mockReturnValue(throwError(() => new Error("some error")));

    // prepare fixture
    const fixture = TestBed.createComponent(EpisodeViewComponent);
    fixture.detectChanges();

    // no quotes
    expect(selectFixture(fixture, '.err-quotes').textContent).toContain('Cannot load quotes.');
  });

  it('fire snackbar on error for 3 seconds', fakeAsync(() => {
    // get quotes is errored
    quoteService.getQuotes.mockReturnValue(throwError(() => new Error("some error")));

    // prepare fixture
    const fixture = TestBed.createComponent(EpisodeViewComponent);
    fixture.detectChanges();

    // err snack bar
    expect(selectFixtureParent(fixture, '.mat-mdc-snack-bar-label').textContent).toContain('some error');

    // wait 2 seconds
    tick(2500);
    expect(selectFixtureParent(fixture, '.mat-mdc-snack-bar-label').textContent).toContain('some error');

    // wait extra 1 seconds
    tick(1000);
    expect(selectFixtureParent(fixture, '.mat-mdc-snack-bar-label')).toBeNull();
  }));
});

const mockCharacters: Character[] = [
  {id: 1, name: 'Character 1'},
  {id: 2, name: 'Character 2'},
];
const mockEpisodes: Episode[] = [
  {id: 1, title: 'title 1', season: 1},
  {id: 2, title: 'title 2', season: 2},
];

const mockQuotes: Quote[] = [
  {character: mockCharacters[0], text: 'Quote 1', episode: mockEpisodes[0]},
  {character: mockCharacters[1], text: 'Quote 2', episode: mockEpisodes[1]},
];

function selectFixture<T>(fixture: ComponentFixture<T>, selector: string) {
  return fixture.nativeElement.querySelector(selector);
}

function selectAllFixture<T>(fixture: ComponentFixture<T>, selector: string) {
  return fixture.nativeElement.querySelectorAll(selector);
}

function selectFixtureParent<T>(fixture: ComponentFixture<T>, selector: string) {
  return fixture.nativeElement.parentNode.querySelector(selector);
}
