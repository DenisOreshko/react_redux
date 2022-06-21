import {v4 as uuidv4} from 'uuid';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {heroAdded} from '../heroesList/heroesSlice';
import {useHttp} from '../../hooks/http.hook';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {

    const {filters} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [element, setElement] = useState('');


    const onClickCreateButton = (e) => {
        e.preventDefault();

        const newHero = {id: uuidv4(), 
                         name, 
                         description: text, 
                         element};                        

        request(`http://localhost:3001/heroes/`, 'POST', JSON.stringify(newHero))
            .then(res => console.log(res.name, 'Success Added'))
            .then(dispatch(heroAdded(newHero)))
            .catch(err => console.log(err));
    };

    const onValueChange = (e) => {
        switch(e.target.name){
            case 'name': setName(e.target.value);break;
            case 'text': setText(e.target.value);break;
            case 'element': setElement(e.target.value);break;
            default:break;
        }
    }

    const renderOption = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтров нет</h5>
        }
        
        return arr.map(({name,label}) => {

            if(name === 'all') return;

            return <option key={name} value={name}>{label}</option>            
        })
    }

    const elements = renderOption(filters);

    return (
        <form className="border p-4 shadow-lg rounded"
              onSubmit={onClickCreateButton}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={name}
                    onChange={onValueChange}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={text}
                    onChange={onValueChange}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    onChange={onValueChange}
                    value={element}>
                    <option >Я владею элементом...</option>
                    {elements}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}
export default HeroesAddForm;