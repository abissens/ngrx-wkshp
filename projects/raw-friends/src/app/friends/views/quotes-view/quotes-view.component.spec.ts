import {TestBed} from '@angular/core/testing';

import {QuotesViewComponent} from './quotes-view.component';
import {FriendsModule} from '../../friends.module';
import {QuoteService} from '../../services/quote.service';
import {Quote} from '../../domain/quote.model';
import {Character} from '../../domain/character.model';
import {Episode} from '../../domain/episode.model';
import {of, Subject} from 'rxjs';
import {AppRoutingModule} from '../../../app-routing.module';

describe('QuotesViewComponent', () => {
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
      declarations: [QuotesViewComponent],
      imports: [FriendsModule, AppRoutingModule],
      providers: [{provide: QuoteService, useValue: quoteService}],
    });
  });

  it('create', () => {
    const fixture = TestBed.createComponent(QuotesViewComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('load quotes on initialization', () => {
    // get quotes init
    quoteService.getQuotes.mockReturnValue(of(mockQuotes));

    // prepare fixture
    const fixture = TestBed.createComponent(QuotesViewComponent);
    fixture.detectChanges();

    // load mock quotes
    const select = fixture.nativeElement.querySelector.bind(fixture.nativeElement);
    expect(select('.quote-item:nth-child(1) .character-name').textContent).toContain('Character 1');
    expect(select('.quote-item:nth-child(1) .quote-text').textContent).toContain('Quote 1');
    expect(select('.quote-item:nth-child(2) .character-name').textContent).toContain('Character 2');
    expect(select('.quote-item:nth-child(2) .quote-text').textContent).toContain('Quote 2');
  });

  it('should display "Loading quotes..." on loading', () => {
    // Given empty observable
    let subject = new Subject<Quote[]>();
    quoteService.getQuotes.mockReturnValue(subject);

    // prepare fixture
    const fixture = TestBed.createComponent(QuotesViewComponent);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector.bind(fixture.nativeElement);
    expect(select('.loading-indicator').textContent).toContain('Loading quotes...');

    // load mock quotes
    subject.next(mockQuotes);
    subject.complete();
    fixture.detectChanges();

    expect(select('.loading-indicator')).toBeNull();

    expect(select('.quote-item:nth-child(1) .character-name').textContent).toContain('Character 1');
    expect(select('.quote-item:nth-child(1) .quote-text').textContent).toContain('Quote 1');
    expect(select('.quote-item:nth-child(2) .character-name').textContent).toContain('Character 2');
    expect(select('.quote-item:nth-child(2) .quote-text').textContent).toContain('Quote 2');

  });

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
