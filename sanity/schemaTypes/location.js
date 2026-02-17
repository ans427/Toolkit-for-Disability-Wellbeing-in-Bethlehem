export default {
    name: 'location',
    title: 'Accessible Location',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Place Name',
            type: 'string',
        },
        {
            name: 'address',
            title: 'Address',
            type: 'string',
        },
        {
            name: 'coordinates',
            title: 'Coordinates',
            type: 'geopoint',
        },
        {
            name: 'accessibilityFeatures',
            title: 'Accessibility Features',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Wheelchair Ramp', value: 'ramp' },
                    { title: 'Accessible Bathroom', value: 'bathroom' },
                    { title: 'Elevator', value: 'elevator' },
                    { title: 'Automatic Doors', value: 'automaticDoors' },
                ],
            },
        },
    ],
}