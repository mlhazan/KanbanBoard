import React, { Component,PropTypes } from 'react';
import List from './List.jsx';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class KanbanBoard extends Component{
    render(){
        return(
            <div class="app">
                <List id="todo" title ="To Do" taskCallBacks={this.props.taskCallBacks}
                    cardCallbacks={this.props.cardCallbacks}
                    cards = {this.props.cards.filter((card) => card.status==='todo')
                    }/>
                <List id="in-progress" title ="In Progress"  taskCallBacks={this.props.taskCallBacks}
                    cardCallbacks={this.props.cardCallbacks} 
                    cards = {this.props.cards.filter((card) => card.status==="in-progress")
                }/>
                <List id="done" title ="Done"  taskCallBacks={this.props.taskCallBacks}
                    cardCallbacks={this.props.cardCallbacks} 
                    cards = { this.props.cards.filter((card) => card.status==="done")
                }/>
            </div>        
        )
    }          
}
KanbanBoard.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object),
    taskCallBacks : PropTypes.object
}
export default DragDropContext(HTML5Backend)(KanbanBoard);