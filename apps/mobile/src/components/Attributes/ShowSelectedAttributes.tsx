import React from 'react'
import { View } from 'react-native'
import ShowAttribute from './ShowAttribute'

const attributeList = [
    { title: 'furnished', name: 'table-furniture', type: 'material-community' },
    { title: 'house', name: 'house', type: '' },
    { title: 'apartment', name: 'building', type: 'font-awesome' },
    { title: 'terrace', name: 'balcony', type: 'material-community' },
    { title: 'pets', name: 'pets', type: '' },
    { title: 'smoker', name: 'smoking-rooms', type: '' },
    { title: 'disability', name: 'paralysis-disability', type: 'fontisto' },
    { title: 'garden', name: 'nature-people', type: '' },
    { title: 'parking', name: 'local-parking', type: '' },
    { title: 'elevator', name: 'elevator', type: '' },
    { title: 'pool', name: 'pool', type: '' }
]

const ShowSelectedAttributes = ({
    furnished,
    house,
    apartment,
    terrace,
    pets,
    smoker,
    disability,
    garden,
    parking,
    elevator,
    pool
}: {
    furnished: boolean | undefined,
    house: boolean | undefined,
    apartment: boolean | undefined,
    terrace: boolean | undefined,
    pets: boolean | undefined,
    smoker: boolean | undefined,
    disability: boolean | undefined,
    garden: boolean | undefined,
    parking: boolean | undefined,
    elevator: boolean | undefined,
    pool: boolean | undefined
}) => {
    return (
        <View className="flex-row flex-wrap justify-center mb-10">
            {attributeList.map(({ title, name, type }) => {
                return (
                    (title === 'furnished' && furnished) ||
                    (title === 'house' && house) ||
                    (title === 'apartment' && apartment) ||
                    (title === 'terrace' && terrace) ||
                    (title === 'pets' && pets) ||
                    (title === 'smoker' && smoker) ||
                    (title === 'disability' && disability) ||
                    (title === 'garden' && garden) ||
                    (title === 'parking' && parking) ||
                    (title === 'elevator' && elevator) ||
                    (title === 'pool' && pool)
                ) ? (
                    <View className="flex-row items-center" key={title}>
                        <ShowAttribute title={title} name={name} type={type} />
                    </View>
                ) : null;
            })}
        </View>
    )
}


export default ShowSelectedAttributes