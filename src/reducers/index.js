const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
    filters: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }
        case 'HEROES_ADDED':
            const newHeroes = [...state.heroes, action.payload];  
            return {
                ...state,
                heroes: newHeroes,
                heroesLoadingStatus: 'idle'
            }
        case 'HERO_DELETED':
            const newHeroesList = state.heroes.filter(item => item.id !== action.payload);
            return {
                ...state,
                heroes: newHeroesList,
            }
        case 'FILTERS_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'FILTERS_FETCHED':
            return {
                ...state,
                filters: action.payload,
                heroesLoadingStatus: 'idle'
            }
        default: return state
    }
}

export default reducer;