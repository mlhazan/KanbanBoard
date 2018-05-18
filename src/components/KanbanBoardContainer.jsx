import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import KanbanBoard from './KanbanBoard.jsx';


const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'content-type': 'application/json',
    'Authorization': 'any-string-you-like'
};

class KanbanBoardContainer extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            cards:[]
        };
    }
    componentDidMount(){
        fetch(API_URL + '/cards',{headers:API_HEADERS})
            .then((response) =>response.json())
            .then((responseDate) =>{
                this.setState({cards:responseDate});
            })
            .catch((error) =>{
                console.log('Error fetching and parsing data', error);
            });
    }
    render(){
        return <KanbanBoard cards = {this.state.cards}/>
    }
}
export default KanbanBoardContainer;