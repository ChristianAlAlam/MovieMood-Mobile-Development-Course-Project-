import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

/**
 * MovieOptionsMenu - Bottom sheet menu for movie actions
 * 
 * @param {boolean} visible - Controls modal visibility
 * @param {function} onClose - Called when menu should close
 * @param {object} movie - The movie object
 * @param {function} onUpdate - Called with (action, movie) when an option is selected
 */
export default function MovieOptionsMenu({ visible, onClose, movie, onUpdate }) {
  if (!movie) return null;

  const handleAction = (action) => {
    onUpdate(action, movie);
  };

  const handleMenuAction = (action, selectedMovie) => {
  switch (action) {
    case 'edit':
      setSelectedMovie(selectedMovie);
      setEditVisible(true);
      break;
    case 'favorite':
      handleToggleFavorite();
      break;
    case 'completed':
      handleToggleCompleted();
      break;
    case 'delete':
      handleDelete();
      break;
    default:
      break;
  }
};


  const menuOptions = [
    {
      id: 'edit',
      label: 'Edit Movie',
      icon: 'create-outline',
      color: '#4A9EFF',
    },
    {
      id: 'favorite',
      label: movie?.isFavorite ? 'Remove from Favorites' : 'Mark as Favorite',
      icon: movie?.isFavorite ? 'heart-dislike-outline' : 'heart-outline',
      color: '#FF6B9D',
    },
    {
      id: 'completed',
      label: movie?.isCompleted ? 'Mark as Unwatched' : 'Mark as Completed',
      icon: movie?.isCompleted ? 'close-circle-outline' : 'checkmark-circle-outline',
      color: '#4CAF50',
    },
    {
      id: 'delete',
      label: 'Delete Movie',
      icon: 'trash-outline',
      color: '#FF4757',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Options</Text>
                <Text style={styles.movieTitle} numberOfLines={1}>
                  {movie?.title}
                </Text>
              </View>

              {/* Menu Options */}
              <View style={styles.optionsContainer}>
                {menuOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.option}
                    onPress={() => handleAction(option.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: `${option.color}20` }]}>
                      <Ionicons name={option.icon} size={22} color={option.color} />
                    </View>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#666" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#1A1A24',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  optionsContainer: {
    padding: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});