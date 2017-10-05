import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api-staging.pro360.com.tw:443/apis/info/overview.json",
    "method": "GET",
    "headers": {
        // "content-type": "application/json",
        "x-pro360-rest-api-key": "58db15546d6a2b2e17fb96ed",
    }
}
function CompareDifferent(newObj,oldObj){
    const result = []
    Object.entries(newObj).map(([titleKey,objectValue])=>{
        Object.entries(objectValue).map(([key,value])=>{
            if (newObj[titleKey][key]-oldObj[titleKey][key]==0){
                // result.push("<li>"+[titleKey]+" = "+[key]+":new"+newObj[titleKey][key]+":old"+oldObj[titleKey][key]+"\n"+"</li>")
            }else{
                result.push('<li>'+([titleKey]+'\n'+[key])+':'+(newObj[titleKey][key]-oldObj[titleKey][key])+'</li>'+'\n')
            }
        })
    })
    return result
}
function FinallyCompareDifferent(newObj,oldObj){
    const result = []
    Object.entries(newObj).map(([titleKey,objectValue])=>{
        Object.entries(objectValue).map(([key,value])=>{
            result.push([titleKey]+" = "+[key]+":new"+newObj[titleKey][key]+":old"+oldObj[titleKey][key]+"\n")
        })
    })
    return result
}
function CompareValue(newResult,oldResult){
    let result = true
    Object.entries(newResult).map(([titleKey,objectValue])=>{
        Object.entries(objectValue).map(([key,value])=>{
            result = result && (newResult[titleKey][key] == oldResult[titleKey][key])
        })
    })
    return result
}
function TempAlert(msg,duration)
{
    const el = document.createElement("h1");
    el.setAttribute("style","position:absolute;top:10%;left:20%;color:black;background-color:collapse;");
    el.innerHTML = msg;
    setTimeout(function(){
        el.parentNode.removeChild(el);
    },duration);
    document.body.appendChild(el);
}
function TemplateObject(obj, searchValue){
    return(
        Object.entries(obj).map(([TitleKey,ObjectValue])=>{
            return(
                <table key={TitleKey} className="my_table">
                    <tbody>
                    <tr>
                        <h1 key={TitleKey}>{TitleKey}</h1>
                        {Object.entries(ObjectValue).map(([key,value])=>{
                            if (!searchValue || key.indexOf(searchValue.toLowerCase())>-1 ||value.toString().indexOf(searchValue.toLowerCase())>-1){
                                return (
                                    <tr key={key} className="objectColor">
                                        <th>
                                            <td key={key}>{key}</td><td>{value}</td>
                                        </th>
                                    </tr>
                                )
                            }
                        })}
                    </tr>
                    </tbody>
                </table>
            )
        })
    )
}
function show(handlerCompareButton,timeUp) {
    if (timeUp){
        return(
            <CompareButton handlerCompareButton={handlerCompareButton}/>
        )
    }

}
const CompareButton = ({handlerCompareButton})=>{
    return(
        <button onClick={handlerCompareButton}>Compare</button>
    )
}
const SearchBar = ({searchValue,handleFilterTextInputChange})=>{
    return(
        <input type="text"
               placeholder="Search..."
               value={searchValue}
               onChange={handleFilterTextInputChange}
        />
    )
}
class App extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            response:"no response...",
            prev_response: null,
            twentyFour_response:null,
            searchValue:''
        }
        // add search bar
        this.handleFilterTextInputChange = this.handleFilterTextInputChange.bind(this)
        this.handlerCompareButton = this.handlerCompareButton.bind(this)
    }
    handleFilterTextInputChange(e){
        this.setState({
            searchValue:e.target.value
        })
    }
    handlerCompareButton(){
        if (CompareValue(this.state.response,this.state.twentyFour_response)){
            alert(FinallyCompareDifferent(this.state.response,this.state.twentyFour_response).join(""))
        }else{
            alert(FinallyCompareDifferent(this.state.response,this.state.twentyFour_response).join(""))
        }
    }
    componentDidMount() {
        const _this = this
        $.ajax(settings).done(function (response) {
            _this.setState({
                response:response
            })
        });
        setInterval(function(){
            $.ajax(settings).done(function (response) {
                _this.setState({
                    response: response,
                    prev_response:_this.state.response,
                })
            });
        },5000)
        //24h
        setInterval(function(){
            $.ajax(settings).done(function (response) {
                _this.setState({
                    response: response,
                    twentyFour_response:_this.state.prev_response,
                })
            });
        },86400000)
        //setDifferentValue
        setInterval(function(){
            if (CompareValue(_this.state.response,_this.state.prev_response)){
                TempAlert(CompareDifferent(_this.state.response,_this.state.prev_response).join(""),4000)
            }else{
                TempAlert(CompareDifferent(_this.state.response,_this.state.prev_response).join(""),5000)
            }
        },6000)
    }
    render(){
        return(
            <div>
                <SearchBar
                    searchValue={this.state.searchValue}
                    handleFilterTextInputChange={this.handleFilterTextInputChange}
                />
                {TemplateObject(this.state.response, this.state.searchValue)}
                {show(this.handlerCompareButton,this.state.twentyFour_response)}
            </div>
        )
    }
}
ReactDOM.render(
    <App/>,
    document.getElementById('root')
)
