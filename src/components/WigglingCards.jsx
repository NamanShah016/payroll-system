import React, { useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  animate
} from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/base-ui/avatar';

const DRAG_BUFFER = 40;
const VELOCITY_THRESHOLD = 400;

const WigglingCard = ({ emp, i, x, cardWidth, gap, onCardClick }) => {
  const center = -(i * (cardWidth + gap));
  const distance = useTransform(x, (v) => v - center);

  const rotate = useTransform(
    distance,
    [-cardWidth, -cardWidth * 0.1, 0, cardWidth * 0.1, cardWidth],
    [8, 4, 0, -4, -8]
  );

  const blur = useTransform(
    distance,
    [-cardWidth, -cardWidth * 0.2, 0, cardWidth * 0.2, cardWidth],
    [3, 1, 0, 1, 3]
  );

  const opacity = useTransform(
    distance,
    [-cardWidth, -cardWidth * 0.2, 0, cardWidth * 0.2, cardWidth],
    [0.1, 0.9, 1, 0.9, 0.1]
  );

  const filter = useMotionTemplate`blur(${blur}px)`;

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '??';
    return name
      .split(/\s+/)
      .map((word) => word.slice(0, 1))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      key={emp.id}
      style={{
        opacity,
        rotate,
        filter,
        minWidth: cardWidth,
        height: '200px', // Smaller height
        padding: '1.25rem'
      }}
      className="wiggling-card"
      onClick={() => onCardClick(emp)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        
        {/* Top Section: Avatar & Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Avatar style={{ width: '42px', height: '42px', borderRadius: '12px' }}>
            <AvatarImage src={emp.avatar} alt={emp.fullName} />
            <AvatarFallback style={{ fontSize: '0.8rem', background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
              {getInitials(emp.fullName)}
            </AvatarFallback>
          </Avatar>
          <span className="wiggling-card-badge">
            {emp.department}
          </span>
        </div>

        {/* Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.75rem' }}>
          <h3 className="wiggling-card-val" style={{ fontSize: '1.2rem', margin: 0 }}>
            {emp.fullName}
          </h3>
          <p className="wiggling-card-lbl" style={{ fontSize: '0.8rem', margin: 0 }}>
            {emp.designation}
          </p>
        </div>

        {/* Spacer to push content */}
        <div></div>
      </div>

      <button 
        className="wiggling-card-action"
        style={{ width: '32px', height: '32px', right: '1.25rem', bottom: '1.25rem' }}
        onClick={(e) => {
          e.stopPropagation();
          onCardClick(emp);
        }}
      >
        <ArrowUpRight size={14} />
      </button>
    </motion.div>
  );
};

export function WigglingCards({ employees, onCardClick }) {
  const data = employees || [];
  const [index, setIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ cardWidth: 230, gap: 50 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({
          cardWidth: Math.min(width - 64, 220),
          gap: 25,
        });
      } else {
        setDimensions({
          cardWidth: 240,
          gap: 40,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { cardWidth, gap } = dimensions;
  const x = useMotionValue(-(index * (cardWidth + gap)));

  // Drive animation directly into motion value x when index changes
  useEffect(() => {
    const controls = animate(x, -(index * (cardWidth + gap)), {
      type: 'spring',
      stiffness: 280,
      damping: 30
    });
    return () => controls.stop();
  }, [index, cardWidth, gap]);

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setIndex((prev) => Math.min(prev + 1, data.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  if (data.length === 0) return null;

  return (
    <div className="wiggling-carousel-container" style={{ padding: '0.75rem 0' }}>
      <div style={{ width: cardWidth, height: '230px' }} className="wiggling-carousel-viewport">
        <motion.div
          className="flex touch-pan-y"
          drag="x"
          dragConstraints={{
            left: -(data.length - 1) * (cardWidth + gap),
            right: 0,
          }}
          style={{
            x,
            gap: `${gap}px`,
            perspective: 1000,
            display: 'flex'
          }}
          onDragEnd={handleDragEnd}
        >
          {data.map((emp, i) => (
            <WigglingCard
              key={emp.id}
              emp={emp}
              i={i}
              x={x}
              cardWidth={cardWidth}
              gap={gap}
              onCardClick={onCardClick}
            />
          ))}
        </motion.div>
      </div>

      <div className="carousel-dot-container" style={{ marginTop: '0.75rem' }}>
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`carousel-dot ${i === index ? 'active' : ''}`}
            style={{ width: '8px', height: '8px' }}
          />
        ))}
      </div>
    </div>
  );
}
