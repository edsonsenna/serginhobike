const express = require('express');
const jwt        = require("jsonwebtoken");
const mongoose   = require("mongoose");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const port = 4000 ;
const User = require('./models/Usuario');
const mysql = require('mysql');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
      next();
  });

app.use(morgan('dev'));

const router = express.Router();
/*
const apiRoutes = express.Router();

apiRoutes.get('/', function(req, res){
  res.json({ message: 'Bem-vindo a nossa app!' });
});

apiRoutes.get('/usuarios', function(req, res){
  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : '',
    database : 'serginhobikeshop'
  });
  connection.query(`SELECT *FROM usuario`, function(error, data){
      if(error) throw error;
      res.json(data);
      connection.end();
  });
});

app.get('/create', function(req, res){
  //Aqui iremos criar um usuário de exemplo - todas as vezes que formos usar essa rota aparecerá esse usuário
  var usuarioExemplo = new User({
      nome: 'admin',
      senha: 'admin',
      admin: 1
  });

  //Aqui estaremos salvando esse usuário de exemplo:
  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : '',
    database : 'serginhobikeshop'
  });
  connection.query(`INSERT INTO usuario(loginUsuario, senhaUsuario, adminUsuario) VALUES('${usuarioExemplo.nome}', '${usuarioExemplo.senha}', '${usuarioExemplo.admin}')`, function(error, res){
      if(error) throw error;
      console.log('Usuario criado com sucesso!');
      res.json({
        success : true
      });
      connection.end();
  });
});

*/

// ROTA PADRÃO '/' CARREGA PÁGINA INDEX
router.get('/', (req, res) => {
  var arr = {};
  res.render('pages/index',{data:arr})
});
// FIM

//ROTAS GET, PUT, DELETE, POST DOS SERVIDORES


router.delete('/deleteProduto/:id', (req, res) =>{
    execSQLQueryPage('DELETE FROM Produtos WHERE idProduto=' + parseInt(req.params.id), res, 'pages/listarProdutos');
});
//ROTA POST DOS SERVIDORES, CADASTRA SERVIDOR COM DADOS REPASSADOS PELO FORMULARIO E REDIRECIONA PARA PAGINA LISTAR
router.post('/novoProduto', (req, res) =>{
    const status = req.body.status.substring(0,150);
    const marca = req.body.marca.substring(0,150);
    const tipo = req.body.tipo.substring(0,150);
    const descricao = req.body.descricao.substring(0,150);
    const estoquemin = parseInt(req.body.estoquemin);
    const estoquemax= parseInt(req.body.estoquemax);
    execSQLQuery(`INSERT INTO Produto(marcaProduto, descProduto, estoqueMin, estoqueMax, statusProduto) VALUES('${marca}','${descricao}','${estoquemin}','${estoquemax}' ,'${status}')`, res);
    execSQLQueryPage('SELECT * FROM Produto ORDER BY idProduto ASC', res, 'pages/listarProdutos');
});
//

router.post('/novaCompra', (req, res) =>{
    const connection = mysql.createConnection({
      host     : 'localhost',
      port     : 3306,
      user     : 'root',
      password : '',
      database : 'serginhobikeshop'
    });
    var idCompras = 0;
    var fornecedorCompra = req.body.fornecedorCompra;
    connection.query(`INSERT INTO Compra(fornecedorCompra) VALUES('${fornecedorCompra}')`, function(error, res){
        if(error) throw error;
        idCompras = res.insertId;
        //console.log("ID Compras ==>"+idCompras);
        var tamanho = (req.body.idProduto).length;
        for(var i = 0; i < tamanho ; i++){
            //console.log(req.body.idProduto[i]);
            var idProduto = parseInt(req.body.idProduto[i]);
            //console.log(idProduto);
            var qtdCompra = parseFloat(req.body.qtdProduto[i]);
            var valorUnit = parseFloat(req.body.valorUnit[i]);
            connection.query(`INSERT INTO Produtos_compra(idCompra, idProduto, qtdCompra, valorUnitario) VALUES('${idCompras}', '${idProduto}', '${qtdCompra}', '${valorUnit}')`, function(err, result){
                //var idProdutosCompra = results.insertId;
                if(err) throw err;
                //console.log("Produto Inserido com succeso!");
                //console.log("Cadastrando Produto==> ID do Produto: "+idProduto+ "// Quantidade: "+qtdCompra+"// Valor Unitário:"+valorUnit+" Na tablela ID Compra => "+idCompras+" Tabela produtos_compra ID => ");
            });
            //execSQLQuery(`INSERT INTO Produtos_compra(idCompra, idProduto, qtdCompra, valorUnitario) VALUES('${ultimoId}', '${idProduto}', '${qtdCompra}', '${valorUnit}')`, res);

        }
        connection.end();
    });
    //console.log("Ultimo ID de Compra no Post:"+idCompras);


    //console.log("Terminou as bagaças");
    execSQLQueryPage('SELECT * FROM Compra INNER JOIN produtos_compra ON compra.idCompra = produtos_compra.idCompra ', res, 'pages/listarCompras');
});

router.post('/novaVenda', (req, res) =>{
    const connection = mysql.createConnection({
      host     : 'localhost',
      port     : 3306,
      user     : 'root',
      password : '',
      database : 'serginhobikeshop'
    });
    var idCompras = 0;
    var vendedorVenda = req.body.vendedorVenda;
    connection.query(`INSERT INTO Venda(usuarioVenda) VALUES('${vendedorVenda}')`, function(error, res){
        if(error) throw error;
        idVenda = res.insertId;
        //console.log("ID Compras ==>"+idCompras);
        var tamanho = (req.body.idProduto).length;
        for(var i = 0; i < tamanho ; i++){
            //console.log(req.body.idProduto[i]);
            var idProduto = parseInt(req.body.idProduto[i]);
            //console.log(idProduto);
            var qtdVenda = parseFloat(req.body.qtdProduto[i]);
            var valorUnit = parseFloat(req.body.valorUnit[i]);
            connection.query(`INSERT INTO Produtos_venda(idVenda, idProduto, qtdVenda, valorUnitVenda) VALUES('${idVenda}', '${idProduto}', '${qtdVenda}', '${valorUnit}')`, function(err, result){
                //var idProdutosCompra = results.insertId;
                if(err) throw err;
                //console.log("Produto Inserido com succeso!");
                //console.log("Cadastrando Produto==> ID do Produto: "+idProduto+ "// Quantidade: "+qtdCompra+"// Valor Unitário:"+valorUnit+" Na tablela ID Compra => "+idCompras+" Tabela produtos_compra ID => ");
            });
            //execSQLQuery(`INSERT INTO Produtos_compra(idCompra, idProduto, qtdCompra, valorUnitario) VALUES('${ultimoId}', '${idProduto}', '${qtdCompra}', '${valorUnit}')`, res);

        }
        connection.end();
    });
    //console.log("Ultimo ID de Compra no Post:"+idCompras);


    //console.log("Terminou as bagaças");
    execSQLQueryPage('SELECT * FROM Venda INNER JOIN produtos_venda ON venda.idVenda = produtos_venda.idVenda ', res, 'pages/listarVendas');
});

//ROTA GET DOS SERVIDORES, RESPONSAVEL POR RENDERIZAR A PAGINA DE CADASTRO DE SERVIDOR
router.get('/novoProduto', function (req, res) {
  res.render('pages/cadastroProduto');
});
router.get('/novaCompra', function (req, res) {
  execSQLQueryPage(`SELECT *FROM Produto INNER JOIN Estoque ON produto.idProduto = estoque.idProduto`, res, 'pages/cadastroCompra');
  //res.render('pages/cadastroCompra');
});

router.get('/novaVenda', function (req, res) {
  execSQLQueryPage(`SELECT *FROM Estoque INNER JOIN produto ON estoque.idProduto = produto.idProduto `, res, 'pages/cadastroVenda');
})
//

router.get('/listarDetalhesCompra/:id?', (req, res) =>{
  let filter = '';
  if(req.params.id) filter = 'WHERE compra.idCompra='+parseInt(req.params.id);
  execSQLQueryPage('SELECT * FROM Compra INNER JOIN produtos_compra ON compra.idCompra = produtos_compra.idCompra INNER JOIN produto ON produtos_compra.idProduto = produto.idProduto '+filter+'', res, 'pages/listarDetalhesCompra');
});
router.get('/listarDetalhesVenda/:id?', (req, res) =>{
  let filter = '';
  if(req.params.id) filter = 'WHERE venda.idVenda='+parseInt(req.params.id);
  execSQLQueryPage('SELECT * FROM Venda INNER JOIN produtos_venda ON venda.idVenda = produtos_venda.idVenda INNER JOIN produto ON produtos_venda.idProduto = produto.idProduto '+filter+'', res, 'pages/listarDetalhesVenda');
});
router.get('/listarCompras/', (req, res) =>{
  execSQLQueryPage('SELECT * FROM Compra INNER JOIN produtos_compra ON compra.idCompra = produtos_compra.idCompra', res, 'pages/listarCompras');
});
router.get('/listarVendas/:id?', (req, res) =>{
  let filter = '';
  if(req.params.id) filter = 'WHERE idVenda='+parseInt(req.params.id);
  execSQLQueryPage('SELECT * FROM Venda '+filter+' INNER JOIN produtos_venda ON venda.idVenda = produtos_venda.idVenda', res, 'pages/listarVendas');
});


router.get('/listarEstoque/:id?', (req, res) =>{
  let filter = '';
  if(req.params.id) filter = 'WHERE idEstoque='+parseInt(req.params.id);
  execSQLQueryPage('SELECT * FROM Estoque  INNER JOIN produto ON estoque.idProduto = produto.idProduto ORDER BY idEstoque ASC '+filter+'', res, 'pages/listarEstoque');
});

router.get('/paginaSite', function (req, res) {
  res.render('pages/principal')
});


//ROTA GET PARA LISTAR SERVIDOR COM
router.get('/listarProdutos/:id?', (req, res) =>{
  let filter = '';
  if(req.params.id) filter = 'WHERE idProduto='+parseInt(req.params.id);
  execSQLQueryPage('SELECT * FROM Produto '+filter+' ORDER BY idProduto ASC', res, 'pages/listarProdutos');
});
//

//ROTA PUT QUE ATUALIZA OS DADOS DO SERVIDORES PELO FORMULARIO PREENCHIDO
router.put('/servidores/:id', (req, res) =>{
    //  console.log("Entou no put");
    const id = parseInt(req.params.id);
    const nome = req.body.nome.substring(0,150);
    const cpf = req.body.cpf.substring(0,11);
    execSQLQuery(`UPDATE Servidores SET Nome='${nome}', CPF='${cpf}' WHERE ID=${id}`, res);
    execSQLQueryPage('SELECT * FROM Servidores ORDER BY ID ASC', res, 'pages/listarServidor');
});
//

//FIM DAS ROTAS SERVIDORES


// ROTAS GET, PUT, DELETE, POST DOS VEICULOS


// START SERVIDOR LISTEN PORTA 3000
app.use('/', router);
app.use('/api', apiRoutes);
app.listen(port);
console.log('API funcionando!');
//FIM

// FUNCAO PARA EXECUTAR QUERY SIMPLES
function execSQLQuery(sqlQry, res){
  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : '',
    database : 'serginhobikeshop'
  });

  connection.query(sqlQry, function(error, results, fields){
      if(error)
        res.json(error);
      connection.end();
  });
}
// FIM

function execSQLQueryData(sqlQry, res){
  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : '',
    database : 'serginhobikeshop'
  });

  connection.query(sqlQry, function(error, result){
      var lastId = result.insertId;
      console.log("Ultimo ID de compra: "+ lastId);
      if(error)
        res.json(error);
      else return lastId;
      connection.end();
  });
}


// FUNCAO PARA EXECUTAR QUERY COM RETORNA DE PAGINA PASSADA POR PARAMETRO
function execSQLQueryPage(sqlQry, res, page){
  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : '',
    database : 'serginhobikeshop'
  });

  connection.query(sqlQry, function(error, results, fields){
      if(error)
        res.json(error);
      else
        //res.json(results);
        //console.log('Tentativa Redirencionar');
        //console.log(results);
        res.render(page, {data: results});
      connection.end();
      //console.log('executou!');
  });
}
//FIM
