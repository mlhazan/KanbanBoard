import React, { Component } from 'react';
import Card from './Card.jsx';

class List extends Component{
    render(){
        
            var cards = this.props.cards.map((card) =>{
                return <Card id =   {card.id} key={card.id}
                            title = {card.title}
                            description = {card.description}
                            color = {card.color}
                            tasks = {card.tasks} />
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
