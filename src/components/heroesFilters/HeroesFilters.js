import {useDispatch, useSelector} from 'react-redux';
import {filtersFetching, filtersFetched, heroesFetchingError} from '../../actions';
import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const {filters} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))
    }, [dispatch, request]);


    const onFilter = (name) => {
        const newArr = filters.map(function(item) {
            return item.name === name ? {...item, active:'active'} : { ...item, active:''};
        });
        dispatch(filtersFetched(newArr))
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтров нет</h5>
        }

        return arr.map(({name, active, ...props}) => {
            return <Filter key={name} active={active} {...props} onFilter={()=> onFilter(name, active)}/>
        })
    }

    const elements = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

const Filter = ({label, clazz, active, onFilter}) => {
    return (
        <button onClick={onFilter} className={`btn btn-${clazz} ${active}`}>{label}</button>
    )
}

export default HeroesFilters;