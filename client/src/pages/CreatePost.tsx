import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import  preview  from '../assets/preview.png'
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from '../components'


function CreatePost() {
  const navigate = useNavigate();
  const [form, setform] = useState({
    name: '',
    title: '',
    content: '',
  });
  const [generatingImg, setgeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const generateImage = async () => {
    if(form.prompt) {
      try {
        setgeneratingImg(true);
        //api call
        const response = await fetch('http://localhost:5555/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          //send prompt to api
          body: JSON.stringify({ prompt: form.prompt }),
        });

        //get response
        const data = await response.json();
        setform({ ...form, photo: `data:image/jpeg;base64,${data.photo}`}); //save and render image
      } catch (error) {
          alert(error);
      } finally {
        setgeneratingImg(false);
      }
    } else {
      alert('Digite um prompt');
    }
  }
  
  const handleSubmit = async (e:Event) => {
    e.preventDefault();

    if(form.prompt && form.photo) {
      setLoading(true);
      
      try {
        const response = await fetch('http://localhost:5555/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        });

        await response.json();
        navigate('/');

      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Digite um prompt e gere uma imagem');
    }
  };


  const handleChange = (e:Event) => {
    setform({ ... form, [e.target.name]: e.target.value })
  };
  
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setform({ ... form, prompt: randomPrompt });
  };

  return (
    <section className='max-w-7x1 mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Criar</h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>Crie uma coleção de imagens visualmente impressionantes por meio de IA e compartilhe com a comunidade</p>
      </div>

      <form className='mt-16 max-w-3x1' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField 
            labelName = "Seu nome"
            type = "text"
            name = "name"
            placeholder = "Iago Pires"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField 
            labelName = "Prompt"
            type = "text"
            name = "prompt"
            placeholder = "Um gato comendo um bolo"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 g-64 flex justify-center items-center'>
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className='w-full h-full object-contain'
              />
            ) : (
              <img
                src={preview}
                alt='Preview'
                className='w-9/12 h-9/12 object-contain opacity-40'
              />
            )}

            {generatingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.2)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className='mt-5 flex gap-5'>
          <button
            type='button' 
            onClick={generateImage} 
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
            {generatingImg ? 'Gerando imagem...' : 'Gerar imagem'}
          </button>
        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>Você poderá compartilhar sua imagem com a comunidade!</p>
          <button
            type='submit'
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
            >
              {loading ? 'Compartilhando...' : 'Compartilhar'}
            </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost