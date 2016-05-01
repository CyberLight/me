var styles = {
    terminal:{
        window: {
            color: 'white',
            backgroundColor: 'black',
            fontFamily:'courier, "courier new", monospace',
            padding: "10px"
        },
        user: {
            color: 'gray'
        },
        machine: {
            color: 'gray'
        },
        cursorContainer: {

        },
        cursor: {
            width: '10px',
            color: 'grey',
            position: 'relative',
            display: 'inline-block',
            backgroundColor: 'grey'
        },
        cursorNegate: {
            width: '10px',
            color: 'black',
            position: 'relative',
            display: 'inline-block',
            backgroundColor: 'black'
        }
    },
    line: {
        symbol: {
            width: '10px',
            color: 'white',
            backgroundColor: 'black',
            position: 'relative',
            display: 'inline-block',
        },
        specialSymbol: {
            width: '10px',
            color: 'white',
            position: 'relative',
            display: 'inline-block',
            backgroundColor: 'blue'
        },
        specialEmptySymbol: {
          width: '10px',
          color: 'black',
          position: 'relative',
          display: 'inline-block',
          backgroundColor: 'black'
        },
        rightTriangle: {
            width: 0,
            height: 0,
            borderTop: '9px solid transparent',
            borderBottom: '9px solid transparent',
            borderLeft: '7px solid blue',
            display: 'inline-block',
            position: 'absolute'
        },
        file:{
          marginRight: '20px',
          color: 'grey'
        },
        info:{
          color: 'grey'
        }
    }
}

// Components
class Cursor extends React.Component {
  constructor(props) {
      super(props);
      this.state = {blink: true};
      this._blink = () => this.setState({blink: !this.state.blink});
  }

  componentDidMount() {
      this.timerId = setInterval(this._blink, 300);
  }

  componentWillUnmount() {
      if(this.timerId){
        clearInterval(this.timerId);
      }
  }

  _getStyles() {
      return this.state.blink ? styles.terminal.cursor : styles.terminal.cursorNegate;
  }

  render() {
    return (<div style={this._getStyles()}>
               {"~"}
            </div>);
  }
}

class LineSymbol extends React.Component {
     constructor(props) {
          super(props);
          this.state = {symbol: props.symbol || ' '};
     }

     render() {
          return (
             <div style={styles.line.symbol}>
                 {this.state.symbol}
             </div>
          );
     }
}

class BeginLineSymbol extends React.Component {
    constructor(props) {
         super(props);
         this.state = {symbol: props.symbol || ' '};
    }

    render() {
          return (
             <div style={styles.line.specialSymbol}>
                 {this.state.symbol}
             </div>
          );
    }
}

class EmptyBeginLineSymbol extends BeginLineSymbol {
    render() {
          return (
             <div style={styles.line.specialEmptySymbol}>
                 {this.state.symbol}
             </div>
          );
    }
}

class TriangleSymbol extends React.Component {
    constructor(props) {
         super(props);
         this.state = {symbol: props.symbol || ' '};
    }

    render() {
          return (
             <div style={styles.line.rightTriangle}>
                 {this.state.symbol}
             </div>
          );
    }
}

class Line extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
            symbols: props.symbols || [],
            typeSymbols: [],
            typedIndex: 1,
          };
          this.runTyping = () => this._runTyping()
     }

     _runTyping(){
          setTimeout(function(){
              this.setState({
                typeSymbols: this.state.symbols.slice(0,this.state.typedIndex),
                typedIndex: this.state.typedIndex
              });
              this.state.typedIndex++;
              if(this.state.typedIndex <= this.state.symbols.length){
                this._runTyping();
              }else{
                if(typeof this.props.onFinish == 'function'){
                  setTimeout(this.props.onFinish.bind(this), this.props.waitAfterFinish || 0);
                }
              }
          }.bind(this), this.props.interval);
     }

     _renderSymbol(symbol, index){
            return (
                <LineSymbol key={"c_"+index} symbol={symbol} />
            )
     }

     _renderCursor(){
        return this.props.cursor ? <Cursor/> : null;
     }

     componentDidMount() {
        requestAnimationFrame(this.runTyping);
     }

     render() {
         return (
            <div>
               <BeginLineSymbol symbol={'~'}/><TriangleSymbol/> {this.state.typeSymbols.map(this._renderSymbol)}{this._renderCursor()}
            </div>
         );
     }
}

class InfoLine extends React.Component {
  componentDidMount() {
     if(typeof this.props.onFinish == 'function'){
       setTimeout(this.props.onFinish, this.props.waitAfterFinish || 0);
     }
  }
  render() {
      return (
         <div style={styles.line.info}>
            <EmptyBeginLineSymbol symbol={'~'}/> {this.props.info}
         </div>
      );
  }
}

class InfoFilesLine extends React.Component {
  componentDidMount() {
     if(typeof this.props.onFinish == 'function'){
       setTimeout(this.props.onFinish, this.props.waitAfterFinish || 0);
     }
  }
  _renderFileNames(fileName, index){
      return (<span key={"f_"+index} style={styles.line.file}>{fileName}</span>)
  }
  render() {
      return (
         <div>
            <EmptyBeginLineSymbol symbol={'~'}/> {this.props.files.map(this._renderFileNames.bind(this))}
         </div>
      );
  }
}

class TerminalUser extends React.Component {
  componentDidMount() {
     if(typeof this.props.onFinish == 'function'){
       setTimeout(this.props.onFinish, this.props.waitAfterFinish || 0);
     }
  }
  render(){
    return(
      <span>
        <span style={styles.terminal.user}>{this.props.user}</span>@
        <span style={styles.terminal.machine}>{this.props.machine}</span>:
        {this.props.path || "/"}#
      </span>
    )
  }
}

class Me extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lines: [
        {data:'grep cyberlight /etc/shadow > shadow.cyberlight'.split(''), waitAfter:2000, type:'line'},
        {data:'john shadow.cyberlight'.split(''), waitAfter:0, type:'line'},
        {data:'Loaded 1 password (FreeBSD MD5 [32/32])', waitAfter:1000, type:'line_info'},
        {data:'guesses: 0 time: 0:02:00:00 (3) c/s: 100936 trying: sathut', waitAfter:5000, type:'line_info'},
        {data:'guesses: 0 time: 0:04:00:00 (3) c/s: 354793 trying: cousun1', waitAfter:2000, type:'line_info'},
        {data:'guesses: 0 time: 0:08:00:00 (3) c/s: 599784 trying: Co_aDfb', waitAfter:3000, type:'line_info'},
        {data:'guesses: 1 time: 0:16:00:00 (3) c/s: 891224 trying: P4$$w3r|)', waitAfter:1000, type:'line_info'},
        {data:'su cyberlight'.split(''), waitAfter:1000, type:'line'},
        {data:'Password:', waitAfter:3000, type:'line_info'},
        {data:{user:'cyberlight', path:"/", machine:"cyberlight-vm"}, waitAfter:1000, type:'user'},
        {data:'ls'.split(''), waitAfter:1000, type:'line'},
        {data:['contact','me', 'README', 'github', 'twitter', 'facebook'], waitAfter:1000, type:'line_info_files'},
        {data:'cat README'.split(''), waitAfter:1000, type:'line'},
        {data:'I am Cyberlight in virtual reality', waitAfter:0, type:'line_info'},
        {data:'It\'s my presentation about me :)', waitAfter:0, type:'line_info'},
        {data:'Powered by React.js! Thank you Facebook Team!', waitAfter:1000, type:'line_info'},
        {data:'cat me'.split(''), waitAfter:1000, type:'line'},
        {data:'Alexander Vishnyakov in real live :)', waitAfter:1000, type:'line_info'},
        {data:'cat contact'.split(''), waitAfter:1000, type:'line'},
        {data:'cyberlight AT live DOT ru', waitAfter:1000, type:'line_info'},
        {data:'cat github'.split(''), waitAfter:1000, type:'line'},
        {data:'https://github.com/CyberLight', waitAfter:1000, type:'line_info'},
        {data:'cat twitter'.split(''), waitAfter:1000, type:'line'},
        {data:'https://twitter.com/aka_CyberLight', waitAfter:1000, type:'line_info'},
        {data:'cat facebook'.split(''), waitAfter:1000, type:'line'},
        {data:'https://www.facebook.com/ninja.anony', waitAfter:1000, type:'line_info'},
        {data:[], waitAfter:0, type:'line'}
      ],
      typeLines: [],
      typingIndex: 0
    };
    if(this.state.lines.length > 0){
      this.state.typeLines = [this.state.lines[0]];
    }
  }
  handleOnFinish(){
    this.state.typingIndex++;
    if(this.state.typingIndex < this.state.lines.length){
      this.state.typeLines.push(this.state.lines[this.state.typingIndex]);
      this.setState({
        typeLines: this.state.typeLines,
      });
    }
  }
  render() {
    return (<div style={styles.terminal.window}>
                <TerminalUser user={"guest"} machine={"cyberlight-vm"} path={"/"}/>
                {
                  this.state.typeLines.map(function(line, index){
                    switch (line.type) {
                      case 'line':
                        return <Line key={"l_"+index}
                                   symbols={line.data}
                                   interval={150}
                                   cursor={this.state.typingIndex == index}
                                   waitAfterFinish={line.waitAfter}
                                   onFinish={()=>this.handleOnFinish()}/>;
                      case 'line_info':
                        return <InfoLine key={"l_"+index}
                                info={line.data}
                                waitAfterFinish={line.waitAfter}
                                onFinish={()=>this.handleOnFinish()}/>
                      case 'line_info_files':
                        return <InfoFilesLine key={"l_"+index}
                                files={line.data}
                                waitAfterFinish={line.waitAfter}
                                onFinish={()=>this.handleOnFinish()}/>
                      case 'user':
                        return <TerminalUser key={"l_"+index}
                                user={line.data.user}
                                path={line.data.path}
                                machine={line.data.machine}
                                waitAfterFinish={line.waitAfter}
                                onFinish={()=>this.handleOnFinish()}/>
                      default:

                    }

                  }.bind(this))
                }
            </div>);
  }
}
ReactDOM.render(<Me user="root" machine="cyberlight-vm" />, document.querySelector('#me'));
