import './Card.css'

const Card = ({ title, img, count }) => {
    return (
        <div className='card'>
            <img src={img} alt={title} className='card-img' onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div className='card-info'>
                <h3 className='card-title'>{title}</h3>
                <p className='card-count'>{count}</p>
            </div>
        </div>
    )
}

export default Card;