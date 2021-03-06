import { createSelector } from 'reselect'
import { requestTickers } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const SET_CURRENCY = 'SET_CURRENCY'
export const SET_CRYPTO = 'SET_CRYPTO'
export const GET_TICKERS = 'GET_TICKERS'
export const RECIEVE_TICKERS = 'RECIEVE_TICKERS'

// Map for crypto names to crypto tickers
const cryptoTickers = {
  bitcoin: 'btc',
  litecoin: 'ltc'
}

// ------------------------------------
// Actions
// ------------------------------------
export function setCurrency(currency) {
  return {
    type: SET_CURRENCY,
    currency
  }
}

export function setCrypto(crypto) {
  return {
    type: SET_CRYPTO,
    crypto
  }
}

export function getTickers() {
  return {
    type: GET_TICKERS
  }
}

export function recieveTickers({ btcTicker, ltcTicker }) {
  return {
    type: RECIEVE_TICKERS,
    btcTicker,
    ltcTicker
  }
}

export const fetchTicker = () => async (dispatch) => {
  dispatch(getTickers())
  const tickers = await requestTickers(['bitcoin', 'litecoin'])
  dispatch(recieveTickers(tickers))

  return tickers
}

// Receive IPC event for receiveCryptocurrency
export const receiveCryptocurrency = (event, currency) => (dispatch) => {
  dispatch({ type: SET_CURRENCY, currency: cryptoTickers[currency] })
  dispatch({ type: SET_CRYPTO, crypto: cryptoTickers[currency] })
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_CURRENCY]: (state, { currency }) => ({ ...state, currency }),
  [SET_CRYPTO]: (state, { crypto }) => ({ ...state, crypto }),
  [GET_TICKERS]: state => ({ ...state, tickerLoading: true }),
  [RECIEVE_TICKERS]: (state, { btcTicker, ltcTicker }) => (
    { ...state, tickerLoading: false, btcTicker, ltcTicker }
  )
}

// Selectors
const tickerSelectors = {}
const cryptoSelector = state => state.ticker.crypto
const bitcoinTickerSelector = state => state.ticker.btcTicker
const litecoinTickerSelector = state => state.ticker.ltcTicker

tickerSelectors.currentTicker = createSelector(
  cryptoSelector,
  bitcoinTickerSelector,
  litecoinTickerSelector,
  (crypto, btcTicker, ltcTicker) => (crypto === 'btc' ? btcTicker : ltcTicker)
)

export { tickerSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  tickerLoading: false,
  currency: '',
  crypto: '',
  btcTicker: null,
  ltcTicker: null
}

export default function tickerReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
