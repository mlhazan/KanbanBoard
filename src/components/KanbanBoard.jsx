import React, { Component,PropTypes } from 'react';
import List from './List.jsx';

class KanbanBoard extends Component{
    render(){
        return(
            <div class="app">
                <List id="todo" title ="To Do" taskCallBacks={this.props.taskCallBacks}
                    cards = {this.props.cards.filter((card) => card.status==='todo')
                    }/>
                <List id="in-progress" title ="In Progress"  taskCallBacks={this.props.taskCallBacks} 
                    cards = {this.props.cards.filter((card) => card.status==="in-progress")
                }/>
                <List id="done" title ="Done"  taskCallBacks={this.props.taskCallBacks} 
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
export default KanbanBoard;