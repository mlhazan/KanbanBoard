import React, { Component } from 'react';
class CheckList extends Component { 
        render() {
            let tasks = this.props.tasks.map((task) => ( 
                <li class="checklist__task" key={task.id}>
                    <input type="checkbox" defaultChecked={task.done} />{task.name}
                    <a href="#" class="checklist__task--remove" />
                </li> 
            ));

            return (
                <div class="checklist">
                    <ul>{tasks}</ul> 
                    <input type="text"
                            class="checklist--add-task"
                            placeholder="Type and hit Enter to add a task"/>
                </div>
            )
        }
}
export default CheckList;