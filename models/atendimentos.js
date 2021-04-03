const moment = require('moment');

const conexao = require('../infraestrutura/conexao');

class Atendimento{
    adiciona(atendimento, res){
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEhValido = atendimento.cliente.length >= 4

        const validacoes = [
            {
                nome: 'data',
                valido: dataEhValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEhValido,
                mensagem: 'Cliente deve ter pelo menos quatro caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if (existemErros){
            res.status(400).json(erros)
        } else{
            const atendimentoDatado = {...atendimento, data, dataCriacao}

            const sql = 'INSERT INTO Atendimentos SET ?'

            conexao.query(sql, atendimentoDatado, (err, resultado) => {
                if (err){
                    res.status(400).json(err)
                } else{
                    const id = resultado.insertId

                    res.status(201).json({...atendimentoDatado, id})
                }
            })
        }
    }

    lista(res){
        const sql = 'SELECT * FROM Atendimentos'

        conexao.query(sql, (err, resultado) => {
            if (err){
                res.status(400).json(erro)
            } else{
                res.status(200).json(resultado)
            }
        })
    }

    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos where id=${id}`

        conexao.query(sql, (err, resultado) =>{
            if (err){
                res.status(400).json(err)
            } else{
                const atendimento = resultado[0]

                res.status(200).json(atendimento)
            }
        })
    }

    altera(id, valores, res){
        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        
        const sql = `UPDATE Atendimentos SET ? WHERE id=?`
        
        conexao.query(sql, [valores, id], (err, resultado) =>{
            if (err){
                res.status(400).json(err)
            } else{
                res.status(200).json({...valores, id})
            }
        })
    }

    deleta(id, res){
        const sql = `DELETE FROM Atendimentos WHERE id=${id}`
        
        conexao.query(sql, (err, resultado) =>{
            if (err){
                res.status(400).json(err)
            } else{
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimento