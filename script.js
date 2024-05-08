class TopDownParser {
    constructor(input_str) {
      this.tokens = input_str.split(' ');
      this.current_token = null;
      this.steps = [];
      this.parseTree = { type: 'S', children: [] };
    }
  
    parse() {
      this.current_token = this.tokens.shift();
      this.steps.push(`${' '.repeat(0)}S -> E`);
      try {
        this.S(0);
        this.steps.push(`${' '.repeat(0)}Parsing successfull!`);
      } catch (error) {
        this.steps.push(`${' '.repeat(0)}Input is not accepted: ${error.message}`);
      }
      return { steps: this.steps, parseTree: this.parseTree };
    }
  
    match(expected_token) {
      if (this.current_token === expected_token) {
        this.current_token = this.tokens.shift() || null;
      } else {
        throw new Error(`Unexpected token: ${this.current_token}`);
      }
    }
  
    S(indent) {
      const node = { type: 'S', children: [] };
      this.steps.push(`${' '.repeat(indent)}S`);
      this.E(indent + 2);
      this.parseTree.children.push(node);
    }
  
    E(indent) {
      const node = { type: 'E', children: [] };
      this.steps.push(`${' '.repeat(indent)}E`);
      this.T(indent + 2);
      this.E_prime(node, indent + 2);
      this.parseTree.children.push(node);
    }
  
    E_prime(node, indent) {
      if (this.current_token === '+') {
        this.steps.push(`${' '.repeat(indent)}E' -> + T E'`);
        this.match('+');
        const plusNode = { type: '+', children: [] };
        this.T(indent + 2);
        plusNode.children.push(this.parseTree.children[this.parseTree.children.length - 1]);
        node.children.push(plusNode);
        this.E_prime(node, indent + 2);
      }
    }
  
    T(indent) {
      const node = { type: 'T', children: [] };
      this.steps.push(`${' '.repeat(indent)}T`);
      this.F(indent + 2);
      this.T_prime(node, indent + 2);
      this.parseTree.children.push(node);
    }
  
    T_prime(node, indent) {
      if (this.current_token === '*') {
        this.steps.push(`${' '.repeat(indent)}T' -> * F T'`);
        this.match('*');
        const timesNode = { type: '*', children: [] };
        this.F(indent + 2);
        timesNode.children.push(this.parseTree.children[this.parseTree.children.length - 1]);
        node.children.push(timesNode);
        this.T_prime(node, indent + 2);
      }
    }
  
    F(indent) {
      const node = { type: 'F', children: [] };
      this.steps.push(`${' '.repeat(indent)}F`);
      if (this.current_token === '(') {
        this.steps.push(`${' '.repeat(indent)}F -> ( E )`);
        this.match('(');
        node.children.push(this.E(indent + 2));
        this.match(')');
      } else if (['id', 'num'].includes(this.current_token)) {
        this.steps.push(`${' '.repeat(indent)}F -> ${this.current_token}`);
        node.value = this.current_token;
        this.match(this.current_token);
      } else {
        throw new Error(`Unexpected token: ${this.current_token}`);
      }
      this.parseTree.children.push(node);
    }
  }
  function Remove(){
    document.getElementById("input").value = "";
    document.getElementById("result").innerHTML = "";
  }
  
  function parseExpression() {
      let inputExpression = document.getElementById('input').value;
      let parser = new TopDownParser(inputExpression);
      let steps = parser.parse().steps;
      
      let resultDiv = document.getElementById('result');
      resultDiv.innerHTML = "";
      let stepIndex = 1;
      steps.forEach(step => {
          if (step === "Parsing successful!") {
              resultDiv.innerHTML += "Parsing successful!";
          } else {
              resultDiv.innerHTML += `Step ${stepIndex}: ${step}<br>`;
              stepIndex++;
          }
      });

      
  }
  