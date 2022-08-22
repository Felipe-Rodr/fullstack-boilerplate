import React, { useState } from 'react'
import { trpc } from '../utils/trpc'

interface IndexProps {

}

const Index = ({}:IndexProps) => {
  const [Input, setInput] = useState('');
  const [DeleteMessage, setDeleteMessage] = useState('')
  const [AddMessage, setAddMessage] = useState('')
  const addPlayer = trpc.useMutation('player.addPlayer')
  const deletePlayerById = trpc.useMutation('player.deletePlayerById')
  const players = trpc.useQuery(['player.getAllPlayers'])
  const CriarPlayer = async (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
    try{
      await addPlayer.mutateAsync(undefined,{
        onSuccess: (data) => {
          if(data){
            setAddMessage('Player criado com sucesso.');
            players.refetch();
          } else {
            setAddMessage('Player não foi criado');
          }
        }
      });
    } catch {
      throw new Error('Erro em "AddPlayer"')
    }
  }
  const DeletarPlayer = async (e:React.FormEvent<HTMLFormElement>, Input:string) => {
    e.preventDefault();
    if(!Number(Input)){
      return setDeleteMessage('Input inválido.')
    }
    try{
        await deletePlayerById.mutateAsync({
        id:Number(Input)
        },{
          onSuccess: (data) => {
            if(data){
              setDeleteMessage('Player deletado com sucesso.');
              players.refetch();
            } else {
              setDeleteMessage('Player não foi encontrado.');
            }
          }
        });
    } catch {
      throw new Error('Erro em "DeletarPlayer"')
    }
  }
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  }
  if (!players.data) {
    return <div>Loading...</div>;
  }
  return (
    <div className='w-full h-full flex flex-col items-center'>
      <button className='w-fit h-fit mt-2 p-2 bg-indigo-600' onClick={(e) => CriarPlayer(e)}>
        Criar Player
      </button>
      <p className=''>{AddMessage}</p>
      <form className='pl-[25px]' onSubmit={(e) => DeletarPlayer(e,Input)}>
        Deletar player por Id:
        <input value={Input} className='relative w-20 h-8 bg-white text-black p-2 ml-2 rounded' onChange={(e) => handleChange(e)}/>
        <p className='absolute ml-[100px]'>{DeleteMessage}</p>
      </form>
      <p className='pt-6'>{players.data ? players.data.map((player) => JSON.stringify(player,null,2)) : 'players undefined'}</p>
    </div>
  );
}

export default Index;