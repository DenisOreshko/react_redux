import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroesFetching, heroesFetched, heroesFetchingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const {heroes, heroesLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        console.log('useEffect() HeroesList')
        //dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     //dispatch(heroesFetching());
    //     // request("http://localhost:3001/heroes/3", 'DELETE')
    //     //     .then(data => dispatch(heroesFetched(data)))
    //     //     .catch(() => dispatch(heroesFetchingError()))
    //     console.log('useEffect() heroes');

    //     // eslint-disable-next-line
    // }, [heroes]);

    const deleteItemById = (id) => {
        // dispatch(heroesFetching());
        // request(`http://localhost:3001/heroes/${id}`, 'DELETE')
        //     .then(data => dispatch(heroesFetched(data)))
        //     .catch(() => dispatch(heroesFetchingError()))
    }

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
            return <HeroesListItem key={id} id={id} {...props} deleteItem={() => deleteItem(id)}/>
        })
    }

    const deleteItem = (id) => {
        const data  = heroes.filter(item => item.id !== id);
        dispatch(heroesFetched(data));
    }

    const elements = renderHeroesList(heroes);

    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;