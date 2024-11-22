import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './app.css';

function App() {
  const [blocks, setBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState('');

  const fetchBlocks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/blocks');
      setBlocks(response.data);
    } catch (error) {
      console.error('Erro ao buscar blocos:', error);
    }
  };

  useEffect(() => {
    fetchBlocks(); 
    const interval = setInterval(() => {
      fetchBlocks(); 
    }, 10000); // 10 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  // Função para adicionar um novo bloco
  const addBlock = async () => {
    if (newBlock) {
      try {
        await axios.post('http://localhost:5000/add_block', { data: newBlock });
        fetchBlocks(); // Atualiza a lista após adicionar
        setNewBlock('');
      } catch (error) {
        console.error('Erro ao adicionar bloco:', error);
      }
    }
  };

  // Função para baixar os logs de auditoria
  const downloadAuditLogs = () => {
    window.location.href = 'http://localhost:5000/audit_logs';
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Grupo 3 - Eng. de Software</h1>
      <h1>4º Período</h1>
      

      <h3>Blockchain</h3>
      <button onClick={fetchBlocks}>Sincronizar Dados</button>
      <div style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', margin: '20px auto', width: '80%' }}>
        {blocks.map((block, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: 'left' }}>
            <strong>Bloco {block.index}</strong>
            <div>Data: {block.data}</div>
            <div>Hash: {block.hash}</div>
            <div>Anterior: {block.Hash_Anterior}</div>
            <div>Timestamp: {new Date(block.timestamp * 1000).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <h3>Cadastrar Novo Bloco</h3>
      <input
        type="text"
        value={newBlock}
        placeholder="Dados do bloco"
        onChange={(e) => setNewBlock(e.target.value)}
        style={{ marginRight: '10px', padding: '5px', width: '200px' }}
      />
      <button onClick={addBlock}>Registrar Bloco</button>

      <h3>Auditoria da Blockchain</h3>
      <button onClick={downloadAuditLogs}>Download Logs de Auditoria</button>
    </div>
  );
}

export default App;
