import React, { Component} from 'react';
import Card from './Card';
import { DropTarget } from 'react-dnd';
import constants from './constants';

const listTargetSpec = {
    hover(props, monitor) {
      const draggedId = monitor.getItem().id;
      props.cardCallbacks.updateStatus(draggedId, props.id)
    }
  };
  function collect(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget()
    };
  }
class List extends Component{
    render(){
        const { connectDropTarget } = this.props;
            var cards = this.props.cards.map((card) =>{
                return <Card key={card.id}
                                taskCallBacks = {this.props.taskCallBacks} 
                                cardCallbacks={this.props.cardCallbacks} {...card} />
            })
            return connectDropTarget(
                <div class ="list">
                    <h1>{this.props.title}</h1>
                    {cards}
                </div>
            )
    }
}

export default DropTarget(constants.CARD, listTargetSpec, collect)(List);
