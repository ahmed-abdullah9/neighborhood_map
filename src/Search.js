import React from 'react';
import { stack as Menu, } from 'react-burger-menu'
import './search.css';
import {Navbar } from 'reactstrap';
import escapeRegExp from 'escape-string-regexp'


class Search extends React.Component {

  state = {
    toggleMenu: true,
    query: '',
    places: this.props.locations,
    show_info:false
  }

    handleToggleMenuClick() {
      this.setState({toggleMenu: !this.state.toggleMenu});
    }

    updateQuery = (query) => {
      this.setState({ query: query.trim() })
      this.Search(query)
    }

    Search =(query)=>{
      let change_place
      if (query) {
        const match = new RegExp(escapeRegExp(query), 'i')
        change_place = this.props.locations.filter((loaction) => match.test(loaction.name))
        this.setState({places:change_place})
        this.props.filtr(change_place)
      } else {
        change_place = this.props.locations;
        this.setState({places:change_place})
        this.props.filtr(change_place)
      }
    }

    ShowPlace=(place) =>{
      let change_place
      change_place = this.props.unique.filter((check) => check.ID === place.ID)
      this.setState({places:change_place})
      this.setState({show_info:true});
      this.props.ShowPlace(place);
    }
    ShowAll= ()=>{
      this.setState({show_info:false});
      this.setState({places:this.props.locations})
      this.props.ShowAll();
    }
   render() {
     const Places = this.state.places
     return (
       <div id="outer-container" >
         <Navbar style={{background:'#373a47', height: '66px', width:'100%'}}>
           </Navbar>
               <Menu noOverlay  isOpen={ this.state.toggleMenu } Menu width={ '280px'}>
                 <input className="searchbar" type="search" placeholder="Search for name" aria-label="search text"
                   onChange = {(event) => this.updateQuery(event.target.value)} style={{ width:'100%',position: 'relative'}}/>
                 <br />
                 <ol>
                 {Places.map( (place) => (
                   <li key={place.name} className='places-list-item' tabIndex='0'  >
                     <div className='place-details'>
                       <button onClick={() => this.ShowPlace(place)} className='clickable-places'>
                         {place.name}
                       </button>
                       <br />
                      {place.unique_info && this.state.show_info ? (
                          <h5>
                            {place.unique_info}
                          </h5>
                        ): ''}
                       <br />
                     </div>
                   </li>
                 ))}
               </ol>
                 <button onClick={()=> this.ShowAll()} className='clickable-places'>
                   Show all Marker
                 </button>
               </Menu>
             </div>
     );
   }
}

export default Search;
