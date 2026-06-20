'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useField } from '@payloadcms/ui'

import { lucideIconNames } from './iconNames'

type Props = {
  path?: string
  name?: string
}

const IconNameField: React.FC<Props> = ({ path, name }) => {
  const { value, setValue } = useField<string>({ path })
  const [inputValue, setInputValue] = useState(value || '')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredIcons, setFilteredIcons] = useState<string[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  useEffect(() => {
    if (inputValue.trim()) {
      const query = inputValue.toLowerCase()
      const filtered = lucideIconNames
        .filter((icon) => icon.toLowerCase().includes(query))
        .slice(0, 10)
      setFilteredIcons(filtered)
      setIsOpen(filtered.length > 0)
      setHighlightedIndex(-1)
    } else {
      setIsOpen(false)
      setFilteredIcons([])
    }
  }, [inputValue])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (iconName: string) => {
    setInputValue(iconName)
    setValue(iconName)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredIcons.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredIcons[highlightedIndex]) {
          handleSelect(filteredIcons[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setValue(newValue)
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (filteredIcons.length > 0) setIsOpen(true)
        }}
        placeholder="Type to search icons..."
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '14px',
          border: '1px solid #3e3e3e',
          borderRadius: '4px',
          backgroundColor: '#1a1a1a',
          color: '#e0e0e0',
          outline: 'none',
        }}
      />
      {isOpen && filteredIcons.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            maxHeight: '240px',
            overflowY: 'auto',
            backgroundColor: '#262626',
            border: '1px solid #3e3e3e',
            borderRadius: '4px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
          }}
        >
          {filteredIcons.map((icon, index) => (
            <div
              key={icon}
              onClick={() => handleSelect(icon)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor:
                  index === highlightedIndex ? '#3e3e3e' : 'transparent',
                color: '#e0e0e0',
                fontSize: '14px',
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {icon}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default IconNameField
