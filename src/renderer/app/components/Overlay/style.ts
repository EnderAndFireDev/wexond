import styled, { css } from 'styled-components';
import { body2, subtitle2, centerImage, caption } from '~/shared/mixins';
import { colors } from '~/renderer/constants';
import { icons } from '../../constants';

export const StyledOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  transition: 0.15s opacity;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const HeaderText = styled.div`
  position: relative;
  display: flex;
  font-size: 16px;
  padding-left: 8px;
  padding-top: 6px;
  padding-right: 24px;
  padding-bottom: 6px;
  margin-bottom: 16px;
  margin-top: -8px;
  border-radius: 50px;
  transition: 0.1s background-color;
  cursor: pointer;

  ${({ clickable }: { clickable: boolean }) => css`
    pointer-events: ${clickable ? 'auto' : 'none'};
  `}

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const HeaderArrow = styled.div`
  ${centerImage('18px', '18px')};
  margin-left: 8px;
  height: 16px;
  width: 16px;
  background-image: url(${icons.forward});
  filter: invert(100%);
`;

export const DropArrow = styled.div`
  ${centerImage('24px', '24px')};
  margin-left: 8px;
  height: 32px;
  width: 32px;
  background-image: url(${icons.down});
  filter: invert(100%);
  border-radius: 50%;
  transition: 0.1s background-color;
`;

export const Separator = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
`;

export const Section = styled.div`
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.12);
  margin-bottom: 24px;
  border-radius: 30px;
  color: white;
  overflow: hidden;
`;

export const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.12);
  margin-bottom: 24px;
  border-radius: 30px;
  color: white;
  overflow: hidden;
  width: 50%;
`;

export const WeatherHeader = styled.div`
  width: 100%;
  padding: 24px;
  background-image: linear-gradient(to bottom right, #2196f3, #64b5f6);
  display: flex;
`;

export const WeatherTitle = styled.div`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 8px;
`;

export const WeatherNumber = styled.div`
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

export const WeatherSymbol = styled.div`
  font-size: 24px;
  font-weight: 300;
  margin-top: 16px;
`;

export const WeatherLeft = styled.div`
  flex: 1;
`;

export const WeatherIcon = styled.div`
  ${centerImage('96px', '96px')};
  width: 96px;
  height: 96px;
`;

export const WeatherContent = styled.div`
  padding: 24px;
`;

export const Menu = styled.div`
  display: flex;
  margin-left: -16px;
  margin-top: -16px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Scrollable = styled.div`
  position: absolute;
  overflow-y: scroll;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Title = styled.div`
  font-size: 24px;
  margin-left: 24px;
  font-weight: 300;
  margin-bottom: 16px;
  margin-top: 24px;
  color: white;
  position: relative;
  display: flex;
  padding-right: 42px;

  &:hover {
    ${DropArrow} {
      background-color: rgba(0, 0, 0, 0.15);
    }
  }
`;

export const Content = styled.div`
  width: calc(100% - 64px);
  max-width: 800px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
