import React, { Component } from 'react';
import CheckList from './CheckList.jsx';
import marked from 'marked';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { DragSource, DropTarget  } from 'react-dnd';
import constants from './constants';

let titlePropType = (props, propName, componentName) =>{
    if(props[propName]){
        let value = props[propsName];
        if(typeof value !=='string' || value.length > 80){
            return new Error(`${propName} in ${componentName}  is longer than 80 characters`);
        }
    }
}
const cardDragSpec = {
    beginDrag(props) {
      return {
            id: props.id,
            status:props.status
        }
    },
    endDrag(props) {
        props.cardCallbacks.persistCardDrag(props.id, props.status);
    }
}
const cardDropSpec = {
    hover(props, monitor) {
      const draggedId = monitor.getItem().id;
      props.cardCallbacks.updatePosition(draggedId, props.id);
    }
}
let collectDrag = (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource()
    };
}
let collectDrop = (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
    };
}
class Card extends Component { 
    constructor(){
        super(...arguments);
        this.state = {
            showDetails: false
        };
    }
    toggleDetails(){
        this.setState({showDetails: !this.state.showDetails});
    }
    render() {
        const { connectDragSource, connectDropTarget } = this.props;
        let cardDetails;
        if(this.state.showDetails){
            cardDetails = (
                <div class="card__details">
                    {/* {marked(this.props.description)} */}
                    <span dangerouslySetInnerHTML={{__html:marked(this.props.description)}} />
                    <CheckList cardId={this.props.id} tasks={this.props.tasks} 
                    taskCallBacks={this.props.taskCallBacks} />
                </div>
            )
        }
        let sideColor = {
            position:'absolute',
            zIndex: -1,
            top: 0,
            bottom: 0,
            left: 0,
            width: 7,
            backgroundColor: this.props.color

        }
        return connectDropTarget(connectDragSource(
            
            <div class="card">
                <div style={sideColor}/>
                <div className={this.state.showDetails? "card__title card__title--is-open" : "card__title"} 
                        onClick={this.toggleDetails.bind(this)}>
                        {this.props.title}
                </div>
                
                <ReactCSSTransitionGroup transitionName="toggle">
                                         {/* transitionEnterTimeout = {250}
                                         transitionLeaveTimeout = {250}> */}
                    {cardDetails}
                </ReactCSSTransitionGroup>
            </div>
             ));
    } }
//export default DragSource(constants.CARD, cardDragSpec, collectDrag)(Card);
const dragHighOrderCard = DragSource(constants.CARD, cardDragSpec, collectDrag)(Card);
const dragDropHighOrderCard = DropTarget(constants.CARD, cardDropSpec,collectDrop)(dragHighOrderCard);
export default dragDropHighOrderCard