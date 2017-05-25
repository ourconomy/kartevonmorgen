import T from "../constants/ActionTypes";
import { MAIN_IDS, IDS } from "../constants/Categories";

const initialState = {
  text: null,
  city: null,
  result: [],
  current: null,
  categories: MAIN_IDS.filter((c) => c !== IDS.EVENT),
  highlight: [],
  invisible: [],
  addresses: [],
  cities: []
};

const isCity = x =>
  (
    (
      (x["class"] === 'place' && (x.type === 'city' || x.type === 'village')) ||
      (x["class"] === 'boundary' && x.type === 'administrative')
    )
    &&
      (x.address != null)
    &&
    (
      (x.address.city     != null) ||
      (x.address.county   != null) ||
      (x.address.village  != null)
    )
  )

module.exports = (state = initialState, action = {}) => {

  switch (action.type) {

    case T.TOGGLE_SEARCH_CATEGORY:
      const c = action.payload;
      if (c == null) {
        return state;
      }
      //TODO: beautify
      const cats = state.categories.indexOf(c) >= 0
        ? (() => {
          var ref1 = state.categories;
          var results = [];
          var x, i, len;
          for (i = 0, len = ref1.length; i < len; i++) {
            x = ref1[i];
            if (x !== c) {
              results.push(x);
            }
          }
          return results;
        })()
      : [c].concat([].slice.call(state.categories));

      return {
        ...state,
        categories: cats
      }

    case T.SET_SEARCH_TEXT:
      return {
        ...state,
        text: action.payload
      }

    case T.SET_CITY_SEARCH_TEXT:
      return {
        ...state,
        city: action.payload
      }

    case T.SEARCH_RESULT:
      if (!action.error) {
        return {
          ...state,
          result: action.payload.visible,
          invisible: action.payload.invisible
        }
      }
      return state;
      break;

    case T.SEARCH_ADDRESS_RESULT:
      if (!action.error) {
        const d = action.payload || [];
        return {
          ...state,
          addresses: d,
          cities: d.filter(isCity)
        }
      }
      return {
        ...state,
        addresses: [],
        cities: []
      }
      break;

    case T.NEW_ENTRY_RESULT:
      if (!action.error) {
        var o = {};
        o[state.result.length] = action.payload;
        return {
          ...state,
          result: o
        }
      }
      break;

    case T.SET_CURRENT_ENTRY:
      const p = action.payload;
      if (p != null) {
        console.log("entry: " + p);
        return {
          ...state,
          current: p,
          highlight: [p]
        }
      }
      return {
        ...state,
        current: null
      }
      break;

    case T.HIGHLIGHT_ENTRIES:
      return {
        ...state,
        highlight: action.payload
      }

    default:
      return state;
  }
};
