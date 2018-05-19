import React, { Component} from 'react';
import Card from './Card.jsx';

class List extends Component{
    render(){
        
            var cards = this.props.cards.map((card) =>{
                return <Card key={card.id}
                                taskCallBacks = {this.props.taskCallBacks} {...card} />
            })
            return (
                <div class ="list">
                    <h1>{this.props.title}</h1>
                    {cards}
                </div>
            )
    }
}

export default List;
