import { getCookie, hasCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import { trpc } from '../utils/trpc'

interface IndexProps {

}

const Index = ({}:IndexProps) => {
  const [UserID, setUserID] = useState(0)
  const [DeleteMessage, setDeleteMessage] = useState('')
  const [AddMessage, setAddMessage] = useState('')
  useEffect(() => {
    setUserID(Number(getCookie('qid') ?? 0))
  }, [])
  const utils = trpc.useContext();
  const Player = trpc.useQuery(['player.getPlayerById', {id:UserID}])
  const addPlayer = trpc.useMutation('player.addPlayer',{
    onSuccess: () => {
      setUserID(Number(getCookie('qid')))
      utils.invalidateQueries(['player.getPlayerById'])
    }
  })
  const deletePlayer = trpc.useMutation('player.deletePlayer',{
    onSuccess: () => {
      setUserID(0)
      utils.invalidateQueries(['player.getPlayerById'])
    }
  })
  const handleClick = {
    CriarPlayer : async (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
      try{
        await addPlayer.mutateAsync(undefined,{
          onSuccess: (data) => {
            if(data){
              setAddMessage('Player criado com sucesso.');
            } else {
              setAddMessage('Player não foi criado');
            }
          }
        });
      } catch {
        throw new Error('Erro em "AddPlayer"')
      }
    },
    DeletarPlayer : async (e:React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try{
          await deletePlayer.mutateAsync({
          id:Number(getCookie('qid'))
          },{
            onSuccess: (data) => {
              if(data){
                setDeleteMessage('Player deletado com sucesso.');
                setAddMessage('');
              } else {
                setDeleteMessage('Player não foi encontrado.');
              }
            }
          });
      } catch {
        throw new Error('Erro em "DeletarPlayer"')
      }
    }
  }
  if (!Player.data) {
    return (
      <div className='w-full h-full flex flex-col items-center'>
        <div className='w-fit h-fit flex flex-col items-center p-2 m-3 border'>
          {Player.isLoading && (
            <div>Loading...</div>
          )}
          {!Player.isLoading && (
            <>
              <button className='w-fit h-fit mt-2 p-2 bg-indigo-600' onClick={(e) => handleClick.CriarPlayer(e)}>
                Criar Player
              </button>
              <p className=''>{DeleteMessage}</p>
              <p className=''>Player não encontrado.</p>
            </>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className='w-full h-full flex flex-col items-center'>
      <div className='w-fit h-fit flex flex-col items-center p-2 m-3 border'>
        {Player.isLoading && (
          <div>Loading...</div>
        )}
        {!Player.isLoading && (
          <>
            <button className='w-fit h-fit mt-2 p-2 bg-indigo-600' onClick={(e) => handleClick.DeletarPlayer(e)}>
              Deletar Player
            </button>
            <p className=''>{AddMessage}</p>
            <p className='p-2 ml-8'>Player: {JSON.stringify(Player.data, null, 2)}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Index;