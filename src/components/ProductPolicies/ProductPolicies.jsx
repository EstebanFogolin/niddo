import { useMemo } from 'react'
import './ProductPolicies.css'

const POLITICAS_POR_CATEGORIA = {
    'Hoteles': [
        {
            titulo: 'Check-in / Check-out',
            descripcion: 'Check-in a partir de las 15:00 hrs. Check-out hasta las 11:00 hrs. Early check-in y late check-out sujetos a disponibilidad y cargo adicional.'
        },
        {
            titulo: 'Cancelaciones',
            descripcion: 'Cancelación gratuita hasta 48 hrs antes del check-in. Cancelaciones tardías o no-show: cargo del 100% de la primera noche.'
        },
        {
            titulo: 'Mascotas',
            descripcion: 'Se admiten mascotas de hasta 15kg con cargo adicional de $15 USD por noche. Se requiere notificación previa.'
        },
        {
            titulo: 'Niños y camas extra',
            descripcion: 'Niños menores de 12 años se alojan gratis usando camas existentes. Cama supletoria: $25 USD/noche (sujeto a disponibilidad).'
        },
        {
            titulo: 'Fumadores',
            descripcion: 'Hotel 100% libre de humo. Fumar en áreas designadas únicamente. Multa de $250 USD por fumar en habitaciones.'
        },
        {
            titulo: 'Horario de recepción',
            descripcion: 'Recepción 24 horas. Conserjería disponible de 7:00 a 23:00 hrs.'
        }
    ],
    'Hostels': [
        {
            titulo: 'Check-in / Check-out',
            descripcion: 'Check-in 24 hrs (recepción 24/7). Check-out hasta las 10:00 hrs. Guardaequipaje gratuito antes/después.'
        },
        {
            titulo: 'Cancelaciones',
            descripcion: 'Cancelación gratuita hasta 24 hrs antes. No-show: cargo del 100% de la primera noche.'
        },
        {
            titulo: 'Edad mínima',
            descripcion: 'Mayores de 18 años. Menores de 18 solo con tutor legal y habitación privada.'
        },
        {
            titulo: 'Ruido y convivencia',
            descripcion: 'Silencio obligatorio de 23:00 a 07:00 hrs. Uso de auriculares en áreas comunes. Cero tolerancia a sustancias.'
        },
        {
            titulo: 'Cocina compartida',
            descripcion: 'Disponible 24/7. Limpiar después de usar. Alimentos etiquetados en nevera. Limpieza diaria a las 10:00 hrs.'
        },
        {
            titulo: 'Lockers',
            descripcion: 'Lockers individuales en dormitorios (traer candado). Taquillas grandes en recepción ($2/día).'
        }
    ],
    'Departamentos': [
        {
            titulo: 'Check-in / Check-out',
            descripcion: 'Check-in autónomo con cerradura inteligente (código enviado 24h antes). Check-out 11:00 hrs. Late check-out $30 USD.'
        },
        {
            titulo: 'Cancelaciones',
            descripcion: 'Cancelación gratuita hasta 72 hrs antes. 50% reembolso 24-72 hrs. No reembolso <24 hrs.'
        },
        {
            titulo: 'Fiestas y eventos',
            descripcion: 'Prohibidas fiestas/eventos. Máximo ocupantes según capacidad. Ruido moderado después de 22:00 hrs.'
        },
        {
            titulo: 'Limpieza y daños',
            descripcion: 'Limpieza final incluida. Daños/roturas: cargo según tarifa. Dejar vajilla lavada y basura retirada.'
        },
        {
            titulo: 'Mascotas',
            descripcion: 'Se admiten en departamentos seleccionados (+$20 USD/noche, máx. 1 mascota). Consultar disponibilidad.'
        },
        {
            titulo: 'Estacionamiento',
            descripcion: '1 plaza incluida (si aplica). Plaza adicional $10/día. Vehículos máx. 2.10m altura.'
        }
    ],
    'Bed and breakfast': [
        {
            titulo: 'Check-in / Check-out',
            descripcion: 'Check-in 14:00-20:00 hrs (fuera de horario coordinar). Check-out 10:30 hrs. Desayuno 8:00-10:00 hrs.'
        },
        {
            titulo: 'Cancelaciones',
            descripcion: 'Cancelación gratuita hasta 5 días antes. 50% cargo 2-5 días. 100% <48 hrs.'
        },
        {
            titulo: 'Desayuno incluido',
            descripcion: 'Desayuno casero servido en comedor común. Opciones vegetarianas/celíacas con aviso 24h. Horario 8:00-10:00 hrs.'
        },
        {
            titulo: 'Áreas comunes',
            descripcion: 'Salón, jardín y terraza compartidos. Respeto a otros huéspedes. Silencio después de 23:00 hrs.'
        },
        {
            titulo: 'Mascotas',
            descripcion: 'No se admiten mascotas (salvo perros guía).'
        },
        {
            titulo: 'Atención personalizada',
            descripcion: 'Anfitriones residentes. Recomendaciones locales, reservas de actividades y traslados bajo solicitud.'
        }
    ]
}

const POLITICAS_DEFAULT = [
    {
        titulo: 'Check-in / Check-out',
        descripcion: 'Check-in 15:00 hrs. Check-out 11:00 hrs.'
    },
    {
        titulo: 'Cancelaciones',
        descripcion: 'Política de cancelación según tarifa reservada.'
    },
    {
        titulo: 'Normas de la casa',
        descripcion: 'Respeto a otros huéspedes, no fumar en interiores, silencio nocturno.'
    }
]

const ProductPolicies = ({ category }) => {
    const politicas = useMemo(() => {
        return POLITICAS_POR_CATEGORIA[category] || POLITICAS_DEFAULT
    }, [category])

    return (
        <section className="product-policies">
            <h3 className="policies-title">Políticas de uso</h3>
            <div className="policies-grid">
                {politicas.map((p, i) => (
                    <article key={i} className="policy-card">
                        <h4 className="policy-title">{p.titulo}</h4>
                        <p className="policy-description">{p.descripcion}</p>
                    </article>
                ))}
                <article className="policy-card">
                    <h4 className="policy-title">Contacto por WhatsApp</h4>
                    <p className="policy-description">Podés escribirnos por WhatsApp con el botón flotante. El chat se abre fuera de Niddo y rige la política de privacidad de WhatsApp: no almacenamos ni accedemos a esos mensajes.</p>
                </article>
            </div>
        </section>
    )
}

export default ProductPolicies