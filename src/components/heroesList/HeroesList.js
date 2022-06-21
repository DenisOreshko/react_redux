import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector} from 'reselect'

import { heroDeleted, fetchHeroes } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const filteredHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        (state) => state.heroes.heroes,
        (filter, heroes) => {
            console.log('render');
            if(filter ==='all'){
                
                return heroes;
            }else{
                return heroes.filter(item => item.element === filter);
            } 
        }
    );

    const filteredHeroes = useSelector(filteredHeroesSelector);

    // const filteredHeroes = useSelector(state => {
    //     if(state.filters.activeFilter ==='all'){
    //         console.log('render');
    //         return state.heroes.heroes;
    //     }else{
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter);
    //     }       
    // });
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes(request));
    }, []);
    
    const deleteItem =  useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')            
            .then(res => console.log('Success Deleted'))
            .then(dispatch(heroDeleted(id)))
            .catch(err=>console.log(err))
    }, [request, dispatch]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }
        
        return arr.map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} deleteItem={() => deleteItem(id)}/>
        })
    }   

    const elements = renderHeroesList(filteredHeroes);

    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;