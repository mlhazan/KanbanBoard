import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import KanbanBoard from './KanbanBoard.jsx';
import update from 'react-addons-update';

const API_URL = 'http://kanbanapi.pro-react.com';
//const API_URL = 'http://localhost:8080/app';
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
        //fetch(API_URL+'/cards',{headers:API_HEADERS})
            .then((response) =>response.json())
            .then((responseData) =>{
                this.setState({cards:responseData});
            })
            .catch((error) =>{
                console.log('Error fetching and parsing data', error);
            });
    }

    
    addTask(cardId, taskName){
        // Keep a reference to the original state prior to the mutations 
        // in case you need to revert the optimistic changes in the UI
        let prevState = this.state;
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        // Create a new task with the given name and a temporary ID 
        let newTask = {id:Date.now(), name:taskName, done:false};
        // Create a new object and push the new task to the array of tasks 
        let nextState = update(this.state.cards, {
                            [cardIndex]: {
                                tasks: {$push: [newTask] }
        } });
        // set the component state to the mutated object 
        this.setState({cards:nextState});
        // Call the API to add the task on the server
        fetch(`${API_URL}/cards/${cardId}/tasks`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(newTask)
        })
        .then((response) => {
            if(response.ok){
                return response.json()
        }else 
            //Throw an error and revert back
            throw new Error("Server response wasn't ok")
        })
        .then((responseData) => {
            // When the server returns the definitive ID
            // used for the new Task on the server, update it on React 
            newTask.id=responseData.id;
            this.setState({cards:nextState});
        })
        .catch((error) =>{
            console.log("Fetch Error", error);
            this.setState(prevState);
        });
    }
        
   

    deleteTask(cardId, taskId, taskIndex){
        let prevState = this.state;
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        // Create a new object without the task 
        let nextState = update(this.state.cards, {
                                    [cardIndex]: {
                                    tasks: {$splice: [[taskIndex,1]] }
        } });
        // set the component state to the mutated object 
        this.setState({cards:nextState});
        // Call the API to remove the task on the server
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'delete',
            headers: API_HEADERS
        }).then((response)=>{
            if(!response.ok){
                throw new Error("Server error ");
            }
        })
        .catch((error)=>{
            console.log("Fetch Error", error);
            this.setState(prevState);
        })
    }

    toggleTask(cardId, taskId, taskIndex){
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        // Save a reference to the task's 'done' value
        let newDoneValue;
        // Using the $apply command, you will change the done value to its opposite 
        let nextState = update(this.state.cards, {
                                        [cardIndex]: {
                                            tasks: {
                                                [taskIndex]: {
                                                    done: { $apply: (done) => {
                                                        newDoneValue = !done
                                                        return newDoneValue; 
                                                    }
                                                } 
                                            }
                                        } 
                                    }
                                });
            // set the component state to the mutated object
        this.setState({cards:nextState});
            // Call the API to toggle the task on the server
            fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
                    method: 'put',
                    headers: API_HEADERS,
                    body: JSON.stringify({done:newDoneValue})
                    }
                ).then((response)=>{
                    if(!response.ok){
                        throw new Error("Server response not OK");
                    }
                }).catch((error)=>{
                    console.log("Fetch Error", error);
                    this.setState(prevState);
                });                 
            }
    
    
    updateCardStatus(cardId, listId){
        //find the index of the card
        let cardIndex = this.state.cards.findIndex((card=>card.id == cardId));
        //get the current card
        let card = this.state.cards[cardIndex];
        //only proceed if hovering over a different list
        if(card.status !== listId){
            this.setState (update(this.state,{
                cards: {
                    [cardIndex]:{
                        status:{$set:listId}
                    }
                }
            }));
        }
    }

    updateCardPosition (cardId , afterId) {
        // Only proceed if hovering over a different card
        if(cardId !== afterId) {
          // Find the index of the card
          let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
          // Get the current card
          let card = this.state.cards[cardIndex]
          // Find the index of the card the user is hovering over
          let afterIndex = this.state.cards.findIndex((card)=>card.id == afterId);
          // Use splice to remove the card and reinsert it a the new index
          this.setState(update(this.state, {
            cards: {
              $splice: [
                [cardIndex, 1],
                [afterIndex, 0, card]
                ]    
            }
        })); 
    }    
}
    
persistCardDrag(cardId, status){
    //find the index of the card
    let cardIndex = this.state.cards.findIndex((card) =>card.id = cardId);
    //get the current card
    let card = this.state.cards[cardIndex];

    fetch(`${API_URL}/cards/${cardId}`, {
        method: 'put',
        headers:API_HEADERS,
        body:JSON.stringify({status: card.status, row_order_position:cardIndex})
    }).then((response)=>{
            if(!response.ok){
            // Throw an error if server response wasn't 'ok' // so you can revert back the optimistic changes // made to the UI.
            throw new Error("Server response wasn't OK")
            } 
        })
        .catch((error)=>{
            console.error("Fetch error:",error);
            this.setState( 
                update(this.state, { 
                    cards: {    
                        [cardIndex]: {
                            status: { $set: status }
                        }
                    } 
                })
            );
        }
    )
}
    render(){
        return <KanbanBoard cards = {this.state.cards}
                            taskCallBacks = {{
                                toggle:this.toggleTask.bind(this),
                                delete: this.deleteTask.bind(this),
                                add: this.addTask.bind(this)
                            }}
                            cardCallbacks={{
                                updateStatus: this.updateCardStatus.bind(this),
                                updatePosition: this.updateCardPosition.bind(this),
                                persistCardDrag: this.persistCardDrag.bind(this)
                            }}
                />
    }
}//end of class
export default KanbanBoardContainer;
//page 127 throttle.js not implemented