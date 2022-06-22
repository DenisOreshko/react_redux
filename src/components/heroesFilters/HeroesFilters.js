import {useDispatch, useSelector} from 'react-redux';
import {fetchFilters, filtersFetched, activeFilterChanged, selectAll} from './filtersSlice';
import store from '../../store';
import {useEffect} from 'react';
import Spinner from '../spinner/Spinner';
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const filters = selectAll(store.getState());
    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilters());
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const onFilter = (name) => {
        const newArr = filters.map(function(item) {
            return item.name === name ? {...item, active:'active'} : { ...item, active:''};
        });
        dispatch(filtersFetched(newArr));
        dispatch(activeFilterChanged(name));
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