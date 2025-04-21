import React from 'react'
import './Event.css';

interface EventProps {
  src_img: string;
  state?: string;
  title?: string;
  description?: string;
  fecha?: string;
  hora_inicio?: string;
  hora_final?: string;
}

export const Event = ({src_img, state, title, description, fecha, hora_inicio, hora_final}: EventProps) => {
  return (
    <div className='event_container'>
        <div className='event_card_container'>
            <h2 className='event_state'>
                {state}
            </h2>
            <h1 className='event_title'>
                {title}
            </h1>
            <p className='event_description'>{description}</p>
            <h3 className='event_fecha'>Fecha del evento: <span>{fecha}</span></h3>
            <h3 className='event_hora_inicio'>Hora de inicio: <span>{hora_inicio}</span></h3>
            <h3 className='event_hora_final'>Hora de finalización: <span>{hora_final}</span></h3>
        </div>
        <img src={src_img} className={'event_img'} alt="Attraction" />
    </div>
  )
}
