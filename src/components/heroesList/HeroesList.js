import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroDeleted, heroesFetching, heroesFetched, heroesFetchingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const {heroes, filters, heroesLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))
    }, [request, dispatch]);
    
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

    const filtersData  = (arr) => {
        const filterActive = filters.find(item => item.active === 'active');
        if(filterActive){
            if(filterActive.name === 'all'){
                return arr;
            }
            if(filterActive.name){
                return arr.filter(item => item.element === filterActive.name);
            }
        }
        return arr;
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }
        
        return filtersData(arr).map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} deleteItem={() => deleteItem(id)}/>
        })
    }

    

    const elements = renderHeroesList(heroes);

    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;