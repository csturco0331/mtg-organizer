'use client'
import * as Scry from 'scryfall-sdk'
import React, { useEffect, useState } from 'react'
import styles from '@/app/components/AppFilter/AppFilter.module.css'

interface Types {
    type: string
    types: string[]
}

const AppFilter = () => {

    const [typeList, setTypeList] = useState<Types[]>([])

    async function getCardTypes() {
        const types = []
        const superTypes = Scry.Catalog.supertypes()
        const spellTypes = Scry.Catalog.spellTypes()
        const artifactTypes = Scry.Catalog.artifactTypes()
        const creatureTypes = Scry.Catalog.creatureTypes()
        const enchantmentTypes = Scry.Catalog.enchantmentTypes()
        const planeswalkerTypes = Scry.Catalog.planeswalkerTypes()
        const landTypes = Scry.Catalog.landTypes()
        types.push({type: 'Super Types', types: await superTypes})
        types.push({type: 'Spell Types', types: await spellTypes})
        types.push({type: 'Artifact Types', types: await artifactTypes})
        types.push({type: 'Creature Types', types: await creatureTypes})
        types.push({type: 'Enchantment Types', types: await enchantmentTypes})
        types.push({type: 'Planeswalker Types', types: await planeswalkerTypes})
        types.push({type: 'Land Types', types: await landTypes})
        setTypeList(types)
    }
    
    useEffect(() => {
        getCardTypes()
    }, [])

    return (
        <div className={styles.fullModal}>
            <form>
                <div>
                    <label htmlFor="cardName">Card Name</label>
                    <input type="text" id="cardName" name="cardName"/>
                </div>
                <div>
                    <label htmlFor="text">Text</label>
                    <input type="text" id="text" name="text"/>
                </div>
                <div>
                    <label htmlFor="type">Types</label>
                    <select name="type[]" id="type" multiple={true}>
                        {typeList.map(type => (
                            <optgroup label={type.type}>
                                {type.types.map(types => (
                                    <option value={types}>{types}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
                {/* <div>
                    <label htmlFor="cardName">Card Name</label>
                    <input type="text" id="cardName"/>
                </div> */}
                
            </form>
        </div>
    )
}

export default AppFilter