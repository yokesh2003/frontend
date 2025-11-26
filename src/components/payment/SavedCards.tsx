import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { PaymentCard } from '../../types/Payment';

interface SavedCardsProps {
  cards: PaymentCard[];
  onCardSelect: (card: PaymentCard) => void;
}

const SavedCards: React.FC<SavedCardsProps> = ({ cards, onCardSelect }) => {
  if (cards.length === 0) {
    return (
      <Card>
        <Card.Body>
          <p>No saved cards available.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <Row>
        {cards.map((card) => (
          <Col md={6} key={card.cardId} className="mb-3">
            <Card
              style={{
                cursor: 'pointer',
                borderRadius: '18px',
                overflow: 'hidden',
                background:
                  'linear-gradient(135deg, #021B79 0%, #0575E6 50%, #021B79 100%)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                minHeight: '180px',
              }}
              onClick={() => onCardSelect(card)}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div
                    style={{
                      width: '42px',
                      height: '32px',
                      borderRadius: '6px',
                      background:
                        'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                    }}
                  />
                  <div className="text-end">
                    <div style={{ fontSize: '0.8rem', letterSpacing: '0.08em' }}>
                      {card.cardType?.toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>VISA</div>
                  </div>
                </div>
                <h5
                  className="mb-3"
                  style={{
                    letterSpacing: '0.18em',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                  }}
                >
                  {card.cardNumber.replace(/\d(?=\d{4})/g, '*')}
                </h5>
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                      Valid Till
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                      {new Date(card.expiryDate).toISOString().slice(0, 10)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>{card.cardHolderName}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button variant="secondary" onClick={() => window.history.back()}>
        Back
      </Button>
    </div>
  );
};

export default SavedCards;

