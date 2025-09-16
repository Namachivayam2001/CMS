import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Badge from "@mui/joy/Badge";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";

export default function JoyAppBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Sheet
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 1100,
        boxShadow: "sm",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Left: Menu button (used for mobile sidebar toggle) */}
      <IconButton
        variant="plain"
        color="neutral"
        sx={{ mr: 1, display: { xs: "flex", md: "none" } }}
        onClick={onMenuClick}
      >
        <MenuIcon />
      </IconButton>

      {/* Title */}
      <Typography
        level="title-lg"
        sx={{ display: { xs: "none", sm: "block" }, mr: 2 }}
      >
        Joy UI
      </Typography>

      {/* Search bar */}
      <Input
        placeholder="Search…"
        startDecorator={<SearchIcon />}
        size="sm"
        sx={{
          flex: 1,
          maxWidth: { xs: "150px", sm: "250px" },
          mr: 2,
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      {/* Desktop actions */}
      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
        <IconButton size="sm" color="neutral">
          <Badge badgeContent={4} color="danger">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton size="sm" color="neutral">
          <Badge badgeContent={17} color="danger">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Profile menu */}
        <Dropdown>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: "plain", color: "neutral" } }}
          >
            <AccountCircle />
          </MenuButton>
          <Menu placement="bottom-end">
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
          </Menu>
        </Dropdown>
      </Box>

      {/* Mobile menu button (for profile/notifications/messages) */}
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton size="sm" color="neutral" onClick={handleMenuOpen}>
          <MoreIcon />
        </IconButton>
      </Box>

      {/* Mobile dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        placement="bottom-end"
      >
        <MenuItem>
          <Badge badgeContent={4} color="danger">
            <MailIcon />
          </Badge>
          <Typography level="body-sm" sx={{ ml: 1 }}>
            Messages
          </Typography>
        </MenuItem>
        <MenuItem>
          <Badge badgeContent={17} color="danger">
            <NotificationsIcon />
          </Badge>
          <Typography level="body-sm" sx={{ ml: 1 }}>
            Notifications
          </Typography>
        </MenuItem>
        <MenuItem>
          <AccountCircle />
          <Typography level="body-sm" sx={{ ml: 1 }}>
            Profile
          </Typography>
        </MenuItem>
      </Menu>
    </Sheet>
  );
}
