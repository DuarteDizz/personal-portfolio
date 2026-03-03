import * as en from './portfolioData.en';
import * as pt from './portfolioData.pt';

export function getPortfolioData(lng = 'en') {
  const norm = String(lng || 'en').toLowerCase();
  return norm.startsWith('pt') ? pt : en;
}

export { en, pt };
